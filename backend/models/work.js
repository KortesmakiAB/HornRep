"use strict";

const db = require("../db");
const { NotFoundError, BadRequestError } = require("../expressError");


class Work {

	/** getWork()
	* 	Get 1 work by id.
	*  	Includes associated comments and movements.
	*/

	static async getWork(id) {
		const workResp = await db.query(`
			SELECT 
				works.id,
				title,
				c.first_name AS "fName",
				c.last_name AS "lName",
				c.country,
				c.gender,
				TO_CHAR(duration, 'MI:SS') AS "duration",
				era_style AS "eraStyle",
				highest_note AS "highestNote",
				lowest_note AS "lowestNote",
				difficulty,
				techniques,
				clef,
				TO_CHAR( composition_yr, 'YYYY') AS "compYr",
				accompaniment_type AS "accompType",
				accompaniment_difficulty AS "accompDifficulty",
				u.username,
				submitted_by AS "submittedBy",
				description
			FROM works
			JOIN composers c ON composer_id = c.id
			JOIN users u ON u.id = submitted_by
			WHERE works.id = $1;`,
			[id]
		);
		
		const work = workResp.rows[0];
	
		if (!work) throw new NotFoundError(`Work with id - ${id} not found.`);
	
		const comments = await db.query(`
			SELECT
				c.id,
				comment, 
				u.username,
				u.id AS "userId",
				TO_CHAR(time_stamp_tz, 'mm/dd/yyyy') AS "commentDate"
			FROM comments c
			JOIN users u on u.id = user_id
			WHERE work_id = ${work.id};`
		);
		work.comments = comments.rows;

		const movements = await db.query(`
			SELECT
				id,
				title,
				TO_CHAR(duration, 'MI:SS') AS "duration",
				difficulty,
				highest_note AS "highestNote",
				lowest_note AS "lowestNote"
			FROM movements
			WHERE work_id = ${work.id}
		`);
		work.movements = movements.rows;
	
		return work;
	}

	/**	search()
	* 
	*	If no search fields included, will return all works	
	*
	*	Search fields - all optional:
	*	{ 
	*	  title, minDuration, maxDuration, difficulty, fName, lName, gender, 
	*	  countries, accompType, eraStyle, highestNote, 
	*	  lowestNote, techniques, accompDifficulty,
	*	}
	*	
	*	Search Field Types:
	*	  String: title, fName(composer), lName(composer), gender(composer), accompDifficulty, techniques
	*	  Interval ("HH:MM:SS", string-ish): minDuration, maxDuration. 
	*	  Integer: highestNote, lowestNote.
	*	  Array of strings:  accompType - options["Orchestra", "Piano", "None"], difficulty, countries(of composers)[], eraStyle[].
	*	
	*	NB:
	*	  highestNote (Inclusive. Begins at top of staff. 
	*				eg, if highest note is 'A', then works which list 'G#'and 'G'
	*				as highest will also be included. 
	*				Uses numeric system { G: 1, G#: 2, A: 3, A#: 4, etc.}.),
	*	  lowestNote (Similar to highestNote. Begins at g below middle c. 
	*				Numeric system { G:1, Gb: 2, F:3, E:4, etc.})
	*	
	*	Returns array of work objects	
	*	
	*/

	static async search(searchParams = {} ) {

		let query = `
			SELECT 
				works.id,
				title,
				c.first_name AS "fName",
				c.last_name AS "lName",
				TO_CHAR(duration, 'MI:SS') AS "duration",
				era_style AS "eraStyle",
				difficulty
			FROM works
			JOIN composers c ON composer_id = c.id
			JOIN users u ON u.id = submitted_by 
		`;
		
		const whereExpressions = [];
		const queryValues = [];
		
		const { 
		  title, maxDuration, minDuration, difficulty, eraStyle: era_style, highestNote: highest_note,  
		  lowestNote: lowest_note, techniques, accompType: accompaniment_type, byTitles = true,
		  accompDifficulty: accompaniment_difficulty, fName: first_name, lName: last_name, gender, countries: country
		} = searchParams;

		// ILIKE - case insensitive, partial matches
		// db column may have multiple entries listed within 1 string, eg "Glissando, lip trills, mute, stopped horn". 
		const ilikeStrings = { title, first_name, last_name, techniques };
		const ilikeStrArr = Object.keys(ilikeStrings).filter(key => (ilikeStrings[key] !== '' && ilikeStrings[key] !== undefined));
		for (let filter of ilikeStrArr) {
			queryValues.push(`%${ilikeStrings[filter]}%`);
			filter === 'first_name' || filter === 'last_name'
				? whereExpressions.push(` c.${filter} ILIKE $${queryValues.length}`)
				: whereExpressions.push(` ${filter} ILIKE $${queryValues.length}`);
		}

		const ilikeArrays = { difficulty, accompaniment_type, accompaniment_difficulty };
		for (let key in ilikeArrays) {
			const arr = ilikeArrays[key];
			if (arr && arr.length) arr.forEach(filter => {
				queryValues.push(`%${filter}%`);
				whereExpressions.push(` ${key} ILIKE $${queryValues.length}`);
			});
		}
	
		// EXACT MATCHES
		// each property is an array
		const exactMatches = { country, era_style, };
		// '&&' in case a [] slips through the cracks
		for (let key in exactMatches) {
			const matchArr = exactMatches[key];
			if (matchArr && matchArr.length) {
				matchArr.forEach(m => {
					queryValues.push(m);
					whereExpressions.push(`${key} = $${queryValues.length}`);
				});
			}
		}

		// give gender its own 'exact match' treatment, it's not an array.
		// gender cannot be included in ILIKE because male and female both contain 'male'
		if (gender) {
			queryValues.push(gender);
			whereExpressions.push(`gender = $${queryValues.length}`);
		}

		if (highest_note && Number.isInteger(highest_note)) {
			queryValues.push(highest_note);
			whereExpressions.push(`highest_note <= $${queryValues.length}`);
		}
		if (lowest_note && Number.isInteger(lowest_note)) {
			queryValues.push(lowest_note);
			whereExpressions.push(`lowest_note >= $${queryValues.length}`);
		}
		if (minDuration !== undefined) {
			queryValues.push(minDuration);
			whereExpressions.push(`duration >= $${queryValues.length}`);
		}
		if (maxDuration !== undefined) {
			queryValues.push(maxDuration);
			whereExpressions.push(`duration <= $${queryValues.length}`);
		}

		// WHERE expressions
		// determine use of	OR vs AND
		// eg, user might want to search 2 countries, Germany OR United States
		// Otherwise, use AND
		if (whereExpressions.length) {
			const orColumns = ['difficulty', 'country', 'era_style', 'accompaniment_type', 'accompaniment_difficulty'];
			query += " WHERE ";
			for (let i = 0; i < whereExpressions.length; i++) {
				const exp = whereExpressions[i];
				if (i === 0) query += exp;
				else {
					let orCol = false;
					for (let col of orColumns) {
						if (!orCol && exp.includes(col))  {
							query += ' OR ' + exp;
							orCol = true;
							break;
						}
					};
					if (!orCol) query +=' AND ' + exp;
				}
			}
		}

		if (byTitles === true) query += ' ORDER BY title, c.last_name, c.first_name;'
		else if (byTitles === false) query += ' ORDER BY c.last_name, c.first_name, title;'
		
		const worksResp = await db.query(query, queryValues);

		return worksResp.rows;
	}

	/** addWork()
	*
	* 	Required: title, compId, submittedBy.
	*	Optional: duration, eraStyle, highestNote, lowestNote, difficulty, techniques, clef, compYr, accompType, accompDifficulty.
	*
	*	Integer: compId, submittedBy, highestNote, lowestNote, compYr.
	*	Regular string: title.
	*	Comma separated string: eraStyle, difficulty, techniques, clef, accompType, accompDifficulty.
	*	Duration is a string: "HH:MM:SS".
	*
	*	Returns newly created id (integer).
	*/
	static async addWork(formFields) {
		const { title, compId, submittedBy, duration, eraStyle, highestNote, lowestNote,
				difficulty, techniques, clef, compYr, accompType, accompDifficulty, movements } = formFields;
		
		// schema: composer_id and submitted_by are not "NOT NULL", however they are required.
		const compIdResp = await db.query(`SELECT id FROM composers WHERE id = $1;`, [compId]);
		if (compIdResp.rows.length === 0) throw new BadRequestError('Composer not found. Please include a valid composer id.');
		
		const submittedByResp = await db.query(`SELECT id FROM users WHERE id = $1;`, [submittedBy]);
		if (submittedByResp.rows.length === 0) throw new BadRequestError('User not found. Please include a valid user id.');
		
		const newWorkResp = await db.query(`
			INSERT INTO works (
				title, 
				composer_id, 
				submitted_by, 
				duration, 
				era_style, 
				highest_note, 
				lowest_note,
				difficulty, 
				techniques, 
				clef, 
				composition_yr, 
				accompaniment_type, 
				accompaniment_difficulty
				)
			VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
			RETURNING
				id`,
			[title, compId, submittedBy, duration, eraStyle, highestNote, lowestNote,
			difficulty, techniques, clef, compYr, accompType, accompDifficulty]
		);

		// array of objects
		for (let mvmt of movements) {
			const { work_id, title, duration, difficulty, highest_note, lowest_note } = mvmt;

			await db.query(`
				INSERT INTO movements (
					work_id,
					title,
					duration,
					difficulty,
					highest_note,
					lowest_note
				)
				VALUES ($1,$2,$3,$4,$5,$6)`,
				[work_id, title, duration, difficulty, highest_note, lowest_note]
			);
		}

		return newWorkResp.rows[0].id;
	}


	/** updateWork()
	*
	* 	Updates: title, compId, duration, eraStyle, highestNote, lowestNote,
	*	 difficulty, techniques, clef, compYr, accompType, accompDifficulty
	* 	Does NOT update: "submitted_by" (or "id").
	*	Note: db requires compYear to be "YYYY-MM-DD" (I am going with "YYYY-01-01")
	*
	*	Returns id (integer).
	*/	
	static async updateWork(id, formFields ) {
		const { title, compId, duration, eraStyle, highestNote, lowestNote, difficulty, techniques, clef, compYr, accompType, accompDifficulty } = formFields;
		const query = `
			UPDATE works
			SET 
				title = $1,
				composer_id = $2,
				duration = $3,
				era_style = $4,
				highest_note = $5,
				lowest_note = $6,
				difficulty = $7,
				techniques = $8,
				clef = $9,
				composition_yr = $10,
				accompaniment_type = $11,
				accompaniment_difficulty =$12
			WHERE id = $13 
			RETURNING id`;

		const result = await db.query(query, [title, compId, duration, eraStyle, highestNote, lowestNote,
			difficulty, techniques, clef, compYr, accompType, accompDifficulty, id]);

		const updatedWorkId = result.rows[0];

		if (!updatedWorkId) throw new NotFoundError(`Work with id - ${id} not found.`);

		return updatedWorkId.id;
	}

	/** deleteWork()
	*	returns undefined
	*/
	static async deleteWork(id) {
		const deleteResp = await db.query(`
			DELETE
			FROM works
			WHERE id = $1
			RETURNING id;`,
			[id]
		);

		const deletedWork = deleteResp.rows[0];

		if (!deletedWork) throw new NotFoundError(`Work with id - ${id} not found.`);
	}

	/** getFormChoices()
	* 	Even though this method queries countries from the composers table, I thought it best to keep similar logic in one place.
	*/
	static async getFormChoices() {
		const eraStyleResp = await db.query(`SELECT ARRAY( SELECT DISTINCT era_style FROM works WHERE era_style IS NOT NULL);`);
		
		const countriesResp = await db.query(`SELECT ARRAY( SELECT DISTINCT country FROM composers WHERE country IS NOT NULL AND LENGTH(country) > 0);`);

		const composersResp = await db.query(`SELECT id, CONCAT (last_name, ', ', first_name) AS "compNameLastFirst" FROM composers;`)
		
		return {
			eraStyle: eraStyleResp.rows[0].array,
			countries: countriesResp.rows[0].array,
			composers: composersResp.rows,
		};
	}
}
module.exports = Work;
