'use strict';

const express = require('express');
const jsonschema = require('jsonschema');

const Work = require('../models/work');
const { BadRequestError } = require('../expressError');
const convertToInt = require('../helpers/qString');

const workSearchSchema = require('../schemas/workSearch');
const workNewSchema = require('../schemas/workNew');
const workUpdateSchema = require('../schemas/workUpdate');

const router = new express.Router();


/////////////                           /works routes                      ///////////// 


/** GET /
* 
*	  Search all works or get all
*   
*   Search fields - all optional:
*	{ 
*	  title, duration, difficulty, fName, lName, gender, 
*	  country, accompType, eraStyle, highestNote, 
*	  lowestNote, techniques, accompDifficulty,
*	}
* 
*   Note formats:
*   'HH:MM:SS': minDuration, maxDuration
*   array []: accompanimentType, techniques, country, eraStyle
*   integer: highestNote, lowestNote
*
*   If no search fields included, will return all works
*
*   Returns { works: [{ work details }, ...]}
*   TODO: be specific about what is returned
*   TODO: include auth
* 
*/
router.get('/', async function (req, res, next) {
    try {
		const q = convertToInt(req.query, ['highestNote', 'lowestNote']);
		console.log('^^^^^^^^^^^^^^^^^^^^', q)
		
		const validator = jsonschema.validate(q, workSearchSchema);
		if (!validator.valid) {
			const errs = validator.errors.map(e => e.stack);
			throw new BadRequestError(errs);
     	}

		const works = await Work.search(q);
		return res.json({ works });
    } catch (err) {
      	return next(err);
    }
});

/** GET /:id => { work }
* 
*   Returns complete work details and associated comments
*   TODO: be specific about what is returned
*   TODO: include auth
* 
*/
router.get('/:id', async function (req, res, next) {
    try {
		req.params.id = parseInt(req.params.id);
		
		const work = await Work.getWork(req.params.id);
		return res.json({ work });
    } catch (err) {
      	return next(err);
    }
});

/** POST /
* 
*   Add a new work.
*   Required: title, compId, submittedBy.
*   Optional: duration, eraStyle, highestNote, lowestNote, difficulty, techniques, clef, compYr, accompType, accompDifficulty.
*   (NB: user chooses from a list of composers or may click a button for a form to add a new composer)
*
*   TODO: include auth
*/
router.post('/', async function (req, res, next) {
    try {
		const validator = jsonschema.validate(req.body, workNewSchema);
		if (!validator.valid) {
			const errs = validator.errors.map(e => e.stack);
			throw new BadRequestError(errs);
     	}
		
        const newWorkId = await Work.addWork(req.body);
        return res.status(201).json({ newWorkId });
    } catch (error) {
        return next(error);
    }
});

/** PATCH /:id
* 
*   Updates: title, compId, duration, eraStyle, highestNote, lowestNote, difficulty, techniques, clef, compYr, accompType, accompDifficulty
* 	Does NOT update: "submitted_by" (or "id").
*   All fields are required, except as noted.
*   TODO: what is returned?
*   TODO: include auth
*/
router.patch('/:id', async function (req, res, next) {
    try {
		req.params.id = parseInt(req.params.id);
		
		const validator = jsonschema.validate(req.body, workUpdateSchema);
		if (!validator.valid) {
			const errs = validator.errors.map(e => e.stack);
			throw new BadRequestError(errs);
     	}

        const newWorkId = await Work.updateWork(req.params.id, req.body);
        return res.status(201).json({ newWorkId });
    } catch (error) {
        return next(error);
    }
});

/** DELETE /:id
* Returns { deleted: id }
* TODO add auth
*/
router.delete('/:id', async function (req, res, next) {
    try {
		req.params.id = parseInt(req.params.id);

        await Work.deleteWork(req.params.id);
        return res.json({ deleted: req.params.id });
      } catch (err) {
        return next(err);
      }
});



module.exports = router;