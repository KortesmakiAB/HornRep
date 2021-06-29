'use strict';

const db = require('../db');
const { NotFoundError } = require('../expressError');

class Comment {
    /** addComposer()
    *   Required: { fName, lName, country, gender }
    *   Returns: { id, fName, lName, country, gender }
    */
    static async addComposer({ fName, lName, country, gender }) {
        const newComposer = await db.query(`
            INSERT INTO composers (
                first_name,
                last_name,
                country,
                gender
            )
            VALUES ($1,$2,$3,$4)
            RETURNING
                id,
                first_name AS "fName", 
                last_name AS "lName", 
                country, 
                gender;`,
                [fName, lName, country, gender]
        );
        
        return newComposer.rows[0];

    }

    /** getComposer()
    *   id => { id, fName, lName, country, gender }
    */
    static async getComposer(id) {
        const composerResp = await db.query(`
            SELECT
                id,
                first_name AS "fName",
                last_name AS "lName",
                country,
                gender
            FROM composers
            WHERE id = $1;`,
            [id]
        );

        const composer = composerResp.rows[0];
	
		if (!composer) throw new NotFoundError(`Composer with id - ${id} not found.`);

        return composer;
    }
    
    /** allComposers()
    *   Returns: [{ id, fName, lName, country, gender },...]
    */
    static async allComposers() {
        const composers = await db.query(`
            SELECT
                id,
                first_name AS "fName",
                last_name AS "lName",
                country,
                gender
            FROM composers;`,
        );

        return composers.rows;
    }

    /** updateComposer()
    *   
    *   Updates (required): fName, lName, country, gender.
    * 
    *   Returns { id, fName, lName, country, gender }
    * 
    */
     static async updateComposer(id, { fName, lName, country, gender }) {
		const query = `
			UPDATE composers
			SET 
                first_name = $1, 
                last_name = $2,
                country = $3,
                gender = $4
			WHERE id = $5 
			RETURNING 
                id,
                first_name AS "fName",
                last_name AS "lName",
                country,
                gender;`;

		const result = await db.query(query, [fName, lName, country, gender, id]);

		const updatedComposer = result.rows[0];

		if (!updatedComposer) throw new NotFoundError(`Composer with id - ${id} not found.`);

		return updatedComposer;
    }

    /** deleteComposer()
	*	returns undefined
	*/
	static async deleteComposer(id) {
		const deleteResp = await db.query(`
			DELETE
			FROM composers
			WHERE id = $1
			RETURNING id;`,
			[id]
		);

		const deletedComposer = deleteResp.rows[0];

		if (!deletedComposer) throw new NotFoundError(`Composer with id - ${id} not found.`);
	}
}

module.exports = Comment;