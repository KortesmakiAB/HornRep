'use strict'

const db = require('../db');
const { BadRequestError, NotFoundError } = require('../expressError');
const Comment = require('./comment');
const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    testIds
} = require('./_testCommon');

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

const today = new Date();


describe('Comment.newComment()', () => {
    test('should add a new comment', async () => {
        const comment = {
            comment: 'this is a test comment. Do not test me, test ye be destroyed.',
            userId: testIds.users[1],
            workId: testIds.works[1]
        };
        const newComment = await Comment.newComment(comment);

        expect(newComment).toEqual({
            ...comment,
            id: expect.any(Number),
            commentDate: today.toLocaleDateString('en-US', {year: 'numeric', month: '2-digit', day: '2-digit'})
        });
    });
    
});

describe('Comment.getComment()', () => {
    test('should get id, comment, userId, workId, commentDate.', async () => {
        const comment = await Comment.getComment(testIds.comments[1]);

        expect(comment).toEqual({
            id: expect.any(Number),
            comment: 'this is a terrible work for horn. atrocious',
            userId: testIds.users[0],
            workId: testIds.works[0],
            commentDate: today.toLocaleDateString('en-US', {year: 'numeric', month: '2-digit', day: '2-digit'})
        });
    });
    
    
});

describe('Comment.updateComment()', () => {
    test('should update comment text', async () => {
        const updateText = 'Test comment has been updated.';

        const updatedCommentId = await Comment.updateComment(testIds.comments[1], updateText);

        const updatedComment = await db.query(`
            SELECT
                id,
                comment,
                user_id AS "userId",
                work_id AS "workId",
                TO_CHAR(time_stamp_tz, 'mm/dd/yyyy') AS "commentDate"
            FROM comments
            WHERE id = $1;`,
            [updatedCommentId]
        );

        expect(updatedComment.rows[0]).toEqual({
            id: expect.any(Number),
            comment: updateText,
            userId: testIds.users[0],
            workId: testIds.works[0],
            commentDate: today.toLocaleDateString('en-US', {year: 'numeric', month: '2-digit', day: '2-digit'})
        });
    });
});

describe('Comment.deleteComment()', () => {
    test("should delete a positive comment. We are angry.", async () => {
        const deleteResp = await Comment.deleteComment(testIds.comments[0]);
        expect(deleteResp).toBe(undefined);

        const oneCommentLeft = await db.query(`SELECT * FROM comments;`);
        expect(oneCommentLeft.rows.length).toBe(1);
        expect(oneCommentLeft.rows[0].comment).toBe('this is a terrible work for horn. atrocious');
        expect(oneCommentLeft.rows[0].comment).not.toBe('this is a monumental work for horn. genius');
    });

    test('should throw error if Comment not found - deleteComment()', async () => {
        try {
            await Comment.deleteComment(0);
        } catch (error) {
            expect(error).toEqual(new NotFoundError(`Comment with id - 0 not found.`));
        }
    });
});
