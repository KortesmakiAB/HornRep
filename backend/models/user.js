'use strict';

const db = require('../db');
const bcrypt = require('bcrypt');
const { BadRequestError, NotFoundError, UnauthorizedError } = require('../expressError');
const { BCRYPT_WORK_FACTOR } = require('../config.js');

class User {

    /** registerUser() 
    * 
    *   Register user with data.
    *   TODO, which data is required
    *   isAdmin will be set to 'false' by db.
    *
    *   Returns id (integer)
    *
    *   Throws BadRequestError on duplicates.
    */
    
    // TODO? add check for duplicates/unique fields (username, email)
    // OR remove duplicate checks/BadRequestError
    // update tests
    static async registerUser(formFields) {
        const { username, fName, lName, email, password, category = null } = formFields;
        
        const duplicateCheckUn = await db.query(`
            SELECT username
            FROM users
            WHERE username = $1;`,
            [username]
        );
        
        if (duplicateCheckUn.rows[0]) throw new BadRequestError(`Duplicate username: ${username}`);
    
        const hashedPw = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

        const newUserId = await db.query(`
            INSERT INTO users (
                username,
                first_name,
                last_name,
                email,
                password,
                category)
            VALUES ($1,$2,$3,$4,$5,$6)
            RETURNING id;`,
            [username, fName, lName, email, hashedPw, category]    
        );

        return newUserId.rows[0].id;
    }

    /** getUser()
    *   
    *   id => {username, fName, lName, email, password, category, isAdmin }
    * 
    */
    static async getUser(id) {
        const userResp = await db.query(`
            SELECT
                id,
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

    /** updateUser()
    *   
    *   Updates (required): username, fName, lName, email.
    *   Optional: category.
    *   Does not update: password, isAdmin.
    * 
    *   Return id.
    * 
    */
    static async updateUser(id, formFields) {
        const { username, fName, lName, email, category = null } = formFields;
		const query = `
			UPDATE users
			SET 
                username = $1,
                first_name = $2,
                last_name = $3,
                email = $4,
                category = $5
			WHERE id = $6 
			RETURNING id, 
                username, 
                first_name AS "fName",
                last_name AS "lName",
                email,
                category
                ;`;

		const result = await db.query(query, [username, fName, lName, email, category, id]);

		const updatedUser = result.rows[0];

		if (!updatedUser) throw new NotFoundError(`User with id - ${id} not found.`);
        console.log('&&&&&&&&&&', updatedUser)
		return updatedUser;
    }

    /** deleteUser()
	*	returns undefined
	*/
	static async deleteUser(id) {
		const deleteResp = await db.query(`
			DELETE
			FROM users
			WHERE id = $1
			RETURNING id;`,
			[id]
		);

		const deletedUser = deleteResp.rows[0];

		if (!deletedUser) throw new NotFoundError(`User with id - ${id} not found.`);
	}

    /** authenticate user with username, password.
    *
    *   Returns { username, first_name, last_name, email, is_admin }
    *
    *   Throws UnauthorizedError is user not found or wrong password.
    **/

    static async authenticate(email, password) {
        // try to find the user first
        const result = await db.query(
            `SELECT 
                id,
                username,
                password,
                first_name AS "fName",
                last_name AS "lName",
                email,
                category,
                is_admin AS "isAdmin"
            FROM users
            WHERE email = $1`,
            [email],
        );

        const user = result.rows[0];

        if (user) {
            // compare hashed password to a new hash from password
            const isValid = await bcrypt.compare(password, user.password);
            if (isValid === true) {
                delete user.password;
                return user;
            }
        }

        throw new UnauthorizedError("Invalid username/password");
    }
}

module.exports = User;