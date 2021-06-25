"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
// const { sqlForPartialUpdate } = require("../helpers/sql");


class Work {
	static baseQuery = `SELECT 
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
							u.username
						FROM works
						JOIN composers c ON composer_id = c.id
						JOIN users u ON u.id = submitted_by
						`;


	/** GET 1 work by id.
	*  Includes associated comments.
	*/

	static async getWork(id) {
		const workResp = await db.query(
			`${this.baseQuery}
			WHERE works.id = $1;`,
			[id]
		);
		
		const work = workResp.rows[0];
	
		if (!work) throw new NotFoundError(`Work not found`);
	
		const comments = await db.query(`
			SELECT
				comment, 
				u.username, 
				TO_CHAR(time_stamp_tz, 'mm/dd/yyyy') AS "comment_date"
			FROM comments
			JOIN users u on u.id = user_id
			WHERE u.id = ${work.id};`
		);
		work.comments = comments.rows;

		const movements = await db.query(`
			SELECT
				title,
				TO_CHAR(duration, 'MI:SS') AS "duration",
				difficulty,
				highest_note AS highestNote,
				lowest_note AS lowestNote
			FROM movements
			WHERE work_id = ${work.id}
		`);
		work.movements = movements.rows;
	
		return work;
	}

	/**	search()
	*
	*	Search fields - all optional:
	*	{ 
	*	  title, duration, difficulty, fName, lName, gender, 
	*	  country, accompType, eraStyle, highestNote, 
	*	  lowestNote, techniques, accompDifficulty,
	*	}
	*	
	*	Search Field Types:
	*	  String: title, fName(composer), lName(composer), gender(composer), difficulty, accompDifficulty.
	*	  Interval ("HH:MM:SS", string-ish): minDuration, maxDuration. 
	*	  Integer: highestNote, lowestNote.
	*	  Array of strings:  accompanimentType - options["Orchestra", "Piano", "None"], techniques[any], country(composers)[any], eraStyle[].
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
	*	No search fields included will return all works	
	*/

	static async search(searchParams = {}) {
		// TODO handle searchParams validation
		//  after validation, I could probably remove some of the "!== undefined" checks

		let query = `${this.baseQuery}`;
		const whereExpressions = [];
		const queryValues = [];
		
		const { 
		  title, maxDuration, minDuration, difficulty, eraStyle: era_style, highestNote: highest_note,  
		  lowestNote: lowest_note, techniques, accompType: accompaniment_type, 
		  accompDifficulty: accompaniment_difficulty, fName: first_name, lName: last_name, gender, country
		} = searchParams;

		// ILIKE - case insensitive, partial matches
		// db column may have multiple entries listed within 1 string, eg "Glissando, lip trills, mute, stopped horn". 
		// If search-filter-data is an array, then iterate/search. eg. ["Glissando", "lip trills", "mute", "stopped horn"]
		// Otherwise, just search db by term
		const ilikes = { title, difficulty, first_name, last_name, techniques, country, era_style, accompaniment_type, accompaniment_difficulty };
		for (let filter in ilikes ) {
			if (Array.isArray(ilikes[filter])) ilikes[filter].forEach(f => {
				if(f !== undefined) {
					queryValues.push(`%${f}%`);
					whereExpressions.push(`${[filter]} ILIKE $${queryValues.length}`);
				}
			});
			
			else {
				if (ilikes[filter] !== undefined) {
					queryValues.push(`%${ilikes[filter]}%`);

					filter === 'first_name' || filter === 'last_name'
						? whereExpressions.push(`c.${[filter]} ILIKE $${queryValues.length}`)
						: whereExpressions.push(`${[filter]} ILIKE $${queryValues.length}`);
				}
			}
		}
		
		// TODO - refactor? - do I need to check for an array?
		// Cannot move gender to ILIKE: male and female, both contain "male"
		const exactMatches = { gender };
		for (let match in exactMatches) {
			if (Array.isArray(exactMatches[match])) exactMatches[match].forEach(m => {
				if(m !== undefined) {
					queryValues.push(m);
					whereExpressions.push(`${[match]} = $${queryValues.length}`);
				}
			});
			else {
				if (exactMatches[match] !== undefined) {
					queryValues.push(exactMatches[match]);
					whereExpressions.push(`${[match]} = $${queryValues.length}`);
				}
			}
		}

		const lowHigh = { highest_note, lowest_note };
		for (let val in lowHigh) {
			if (lowHigh[val] !== undefined) {
				queryValues.push(+lowHigh[val]);
				whereExpressions.push(`${[val]} <= $${queryValues.length}`);
			}
		}

		if (minDuration !== undefined) {
			queryValues.push(minDuration);
			whereExpressions.push(`duration >= $${queryValues.length}`);
		}
		if (maxDuration !== undefined) {
			queryValues.push(maxDuration);
			whereExpressions.push(`duration <= $${queryValues.length}`);
		}

		if (whereExpressions.length) {
			query += " WHERE " + whereExpressions.join(" AND ");
		}

		query += ' ORDER BY c.last_name, c.first_name, title';

		const worksResp = await db.query(query, queryValues);
		
		return worksResp.rows;
	}

}
module.exports = Work;
