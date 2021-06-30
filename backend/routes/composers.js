'use strict';

const express = require('express');
const jsonschema = require('jsonschema');

const Composer = require('../models/composer');
const { BadRequestError } = require('../expressError');

const composerSchema = require('../schemas/composer');

const router = new express.Router();


/////////////                           /composers routes                      ///////////// 


/** POST /
* 
*   Required: { fName, lName, country, gender }
*   Returns: { id, fName, lName, country, gender }
*
*   TODO Auth: loggedIn
*/
router.post('/', async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, composerSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }

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
        req.params.id = parseInt(req.params.id);
		
        const composers = await Composer.allComposers(req.params.id);
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
        req.params.id = parseInt(req.params.id);
		
        const composer = await Composer.getComposer(req.params.id);
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
*   TODO Auth: ensureAdmin
*/
router.patch('/:id', async function (req, res, next) {
    try {
        req.params.id = parseInt(req.params.id);
		
        const validator = jsonschema.validate(req.body, composerSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }

        const updatedComposer = await Composer.updateComposer(req.params.id, req.body);
        return res.status(201).json({ updatedComposer });
    } catch (error) {
        return next(error);
    }
});

/** DELETE /:id
*   TODO Auth: ensureAdmin
*/
router.delete('/:id', async function (req, res, next) {
    try {
        req.params.id = parseInt(req.params.id);
		
        await Composer.deleteComposer(req.params.id);
        return res.json({ deleted: req.params.id });
    } catch (err) {
        return next(err);
    }
});



module.exports = router;