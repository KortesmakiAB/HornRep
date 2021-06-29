'use strict';

const express = require('express');

const Composer = require('../models/composer');

const router = new express.Router();


/////////////                           /composers routes                      ///////////// 


/** POST /
* 
*   Required: { fName, lName, country, gender }
*   Returns: { id, fName, lName, country, gender }
*
*   TODO: include auth & validation
*/
router.post('/', async function (req, res, next) {
    try {
        const newComposer = await Composer.addComposer(req.body);
        return res.status(201).json({ newComposer });
    } catch (error) {
        return next(error);
    }
});


/** GET /
* 
*   Returns: { composers: [{ id, fName, lName, country, gender },...]}
* 
*   No auth required
* 
*/
router.get('/', async function (req, res, next) {
    try {
      const composers = await Composer.allComposers(+req.params.id);
      return res.json({ composers });
    } catch (err) {
      return next(err);
    }
});

/** GET /:id
* 
*   id => { composer: { id, fName, lName, country, gender }}
* 
*   No auth required
* 
*/
router.get('/:id', async function (req, res, next) {
    try {
      const composer = await Composer.getComposer(+req.params.id);
      return res.json({ composer });
    } catch (err) {
      return next(err);
    }
});

/** PATCH /:id
* 
*   Updates (required): fName, lName, country, gender
*   
*   Returns { id, fName, lName, country, gender }
*
*   TODO: include auth & validation
*/
router.patch('/:id', async function (req, res, next) {
    try {
        const updatedComposer = await Composer.updateComposer(+req.params.id, req.body);
        return res.status(201).json({ updatedComposer });
    } catch (error) {
        return next(error);
    }
});

/** DELETE /:id
*   TODO add auth
*/
router.delete('/:id', async function (req, res, next) {
    try {
        await Composer.deleteComposer(+req.params.id);
        return res.json({ deleted: req.params.id });
    } catch (err) {
        return next(err);
    }
});



module.exports = router;