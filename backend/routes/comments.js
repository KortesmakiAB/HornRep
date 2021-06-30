'use strict';

const express = require('express');
const jsonschema = require('jsonschema');

const Comment = require('../models/comment');
const { BadRequestError } = require('../expressError');

const commentNewSchema = require('../schemas/commentNew');
const commentUpdateSchema = require('../schemas/commentUpdate');

const router = new express.Router();


/////////////                           /comments routes                      ///////////// 


/** POST /
* 
*   Required: comment, userId, workId
*   
*   Returns { id, comment, userId, workId, commentDate }
*
*   TODO Auth: ensureLoggedIn
*/
router.post('/', async function (req, res, next) {
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
*   TODO Auth: unsure of use case
* 
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

/** PATCH /:id
* 
*   Updates (required): comment (and time_stamp_tz, passively).
*   
*   Does not update: user_id, work_id.
*
*   Returns { comment , userId, workId, commentDate }
*
*   TODO Auth: ensureLoggedIn
*/
router.patch('/:id', async function (req, res, next) {
    try {
        req.params.id = parseInt(req.params.id);
		
        const validator = jsonschema.validate(req.body, commentUpdateSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }

        const updatedComment = await Comment.updateComment(req.params.id, req.body);
        return res.status(201).json({ updatedComment });
    } catch (error) {
        return next(error);
    }
});

/** DELETE /:id
*   TODO Auth: ensureCorrectUserOrAdmin
*/
router.delete('/:id', async function (req, res, next) {
    try {
        req.params.id = parseInt(req.params.id);
		
        await Comment.deleteComment(req.params.id);
        return res.json({ deleted: req.params.id });
    } catch (err) {
        return next(err);
    }
});



module.exports = router;