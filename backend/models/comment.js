'use strict';

const db = require('../db');
const bcrypt = require('bcrypt');
const { BadRequestError, NotFoundError } = require('../expressError');

class Comment {

    /** newComment() 
    * 
    *   Required: comment, userId, workId
    *
    *   Returns { id, comment, userId, workId, commentDate }
    *
    */
    
    // TODO? add check for duplicates/unique fields 
    // then update tests
    static async newComment({ comment, userId, workId }) {
        const newComment = await db.query(`
            INSERT INTO comments (
                comment, 
                user_id, 
                work_id)
            VALUES ($1,$2,$3)
            RETURNING 
                id, 
                comment, 
                user_id AS "userId",
                work_id AS "workId",
                TO_CHAR(time_stamp_tz, 'mm/dd/yyyy') AS "commentDate";`,
            [comment, userId, workId]    
        );

        return newComment.rows[0];
    }

    /** getComment()
    *   
    *   id => { comment , userId, workId, commentDate }
    * 
    */
    static async getComment(id) {
        const commentResp = await db.query(`
            SELECT
                id,
                comment,
                user_id AS "userId",
                work_id AS "workId",
                TO_CHAR(time_stamp_tz, 'mm/dd/yyyy') AS "commentDate"
            FROM comments
            WHERE id = $1;`,
            [id]
        );

        const comment = commentResp.rows[0];
	
		if (!comment) throw new NotFoundError(`Comment with id - ${id} not found.`);

        return comment;
    }

    /** updateComment()
    *   
    *   Updates (required): comment (and time_stamp_tz, passively).
    *   
    *   Does not update: user_id, work_id.
    * 
    *   { id, comment } => { comment , userId, workId, commentDate }
    * 
    */
    static async updateComment(id, { comment } ) {
		const query = `
			UPDATE comments
			SET comment = $1
			WHERE id = $2 
			RETURNING 
                id, 
                comment,
                user_id AS "userId",
                work_id AS "workId",
                TO_CHAR(time_stamp_tz, 'mm/dd/yyyy') AS "commentDate";`;

		const result = await db.query(query, [comment, id]);

		const updatedCommentId = result.rows[0];

		if (!updatedCommentId) throw new NotFoundError(`Comment with id - ${id} not found.`);

		return updatedCommentId;
    }

    /** deleteComment()
	*	returns undefined
	*/
	static async deleteComment(id) {
		const deleteResp = await db.query(`
			DELETE
			FROM comments
			WHERE id = $1
			RETURNING id;`,
			[id]
		);

		const deletedComment = deleteResp.rows[0];

		if (!deletedComment) throw new NotFoundError(`Comment with id - ${id} not found.`);
	}
}

module.exports = Comment;