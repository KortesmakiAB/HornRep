'use strict';

const db = require('../db');
const bcrypt = require('bcrypt');
const { BadRequestError, NotFoundError } = require('../expressError');
const { BCRYPT_WORK_FACTOR } = require('../config.js');

class User {

    /** registerUser() 
    * 
    * Register user with data.
    *
    * Returns id (integer)
    *
    * Throws BadRequestError on duplicates.
    */
    static async registerUser(formFields) {
        const { username, fName, lName, email, password, category, isAdmin } = formFields;
        
        const duplicateCheck = await db.query(`
            SELECT username
            FROM users
            WHERE username = $1;`,
            [username]
        );
        
        if (duplicateCheck.rows[0]) throw new BadRequestError(`Duplicate username: ${username}`);
    
        const hashedPw = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

        const newUserId = await db.query(`
            INSERT INTO users (
                username,
                first_name,
                last_name,
                email,
                password,
                category,
                is_admin)
            VALUES ($1,$2,$3,$4,$5,$6,$7)
            RETURNING id;`,
            [username, fName, lName, email, hashedPw, category, isAdmin]    
        );

        return newUserId.rows[0].id;
    }

    /** getUser(id)
    *   
    *   Get user details by id.
    * 
    */
    static async getUser(id) {
        const userResp = await db.query(`
            SELECT
                username,
                first_name AS "fName",
                last_name AS "lName",
                email,
                password,
                category,
                is_admin AS "isAdmin"
            FROM users
            WHERE id = $1;`,
            [id]
        );

        const user = userResp.rows[0];
	
		if (!user) throw new NotFoundError(`User with id - ${id} not found.`);

        return user;
    }
}

module.exports = User;