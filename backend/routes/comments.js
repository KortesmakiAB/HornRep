'use strict';

const express = require('express');

const Comment = require('../models/comment');

const router = new express.Router();


/////////////                           /comments routes                      ///////////// 


/** POST /
* 
*   Required: comment, userId, workId
*   
*   Returns { id, comment, userId, workId, commentDate }
*
*   TODO: include auth & validation
*/
router.post('/', async function (req, res, next) {
    try {
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
*   TODO: include auth
* 
*/
router.get('/:id', async function (req, res, next) {
    try {
      const comment = await Comment.getComment(+req.params.id);
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
*   TODO: include auth & validation
*/
router.patch('/:id', async function (req, res, next) {
    try {
        const updatedComment = await Comment.updateComment(+req.params.id, req.body);
        return res.status(201).json({ updatedComment });
    } catch (error) {
        return next(error);
    }
});

/** DELETE /:id
*   TODO add auth
*/
router.delete('/:id', async function (req, res, next) {
    try {
        await Comment.deleteComment(+req.params.id);
        return res.json({ deleted: req.params.id });
    } catch (err) {
        return next(err);
    }
});



module.exports = router;