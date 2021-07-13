'use strict';

const express = require('express');
const jsonschema = require('jsonschema');

const Comment = require('../models/comment');
const { ensureLoggedIn, ensureCorrectUser, ensureCorrectUserOrAdmin } = require('../middleware/auth');
const { BadRequestError } = require('../expressError');

const commentNewSchema = require('../schemas/commentNew');
const commentUpdateSchema = require('../schemas/commentUpdate');

const router = new express.Router();


/////////////                           /comments routes                      ///////////// 


/** POST /
* 
*   Required:  req.body is {comment, userId, workId}
*   
*   Returns { id, comment, userId, workId, commentDate }
*/
router.post('/', ensureLoggedIn, async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, commentNewSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }

        const newComment = await Comment.newComment(req.body);

        return res.status(201).json({ newComment });
    } catch (error) {
        return next(error);
    }
});

/** GET /:id
* 
*   id => { user: { comment , userId, workId, commentDate }}
* 
*   TODO Auth: unsure of use case. Comment out?
*/
router.get('/:id', async function (req, res, next) {
    try {
        req.params.id = parseInt(req.params.id);
		
        const comment = await Comment.getComment(req.params.id);

        return res.json({ comment });
    } catch (err) {
        return next(err);
    }
});

/** PATCH /:commentId/:userId
* 
*   Updates (required): comment (and time_stamp_tz(commentDate), passively).
*   
*   Does not update: user_id, work_id.
*
*   Returns { comment , userId, workId, commentDate }
*/
router.patch('/:commentId/:userId', ensureCorrectUser, async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, commentUpdateSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }

        req.params.commentId = parseInt(req.params.commentId);
        const updatedComment = await Comment.updateComment(req.params.commentId, req.body);

        return res.status(201).json({ updatedComment });
    } catch (error) {
        return next(error);
    }
});

/** DELETE /:commentId/:userId
*   
*/
router.delete('/:commentId/:userId', ensureCorrectUserOrAdmin, async function (req, res, next) {
    try {
        req.params.commentId = parseInt(req.params.commentId);
		
        await Comment.deleteComment(req.params.commentId);

        return res.json({ deleted: req.params.commentId });
    } catch (err) {
        return next(err);
    }
});


router.get('/work/:workId', async function (req, res, next) {
    try {
        req.params.workId = parseInt(req.params.workId);
		
        const comments = await Comment.getWorkComments(req.params.workId);

        return res.json({ comments });
    } catch (err) {
        return next(err);
    }
});


module.exports = router;