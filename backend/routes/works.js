'use strict';

const express = require('express');
const jsonschema = require('jsonschema');

const Work = require('../models/work');
const { ensureCorrectUser, ensureCorrectUserOrAdmin } = require('../middleware/auth');
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
*	  title, minDuration, maxDuration, difficulty, fName, lName, gender, 
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
*   
* 	No auth required.
*/
router.get('/', async function (req, res, next) {
    try {
		const q = convertToInt(req.query, ['highestNote', 'lowestNote']);
		
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

/** /checkboxData
* 	Returns 2 arrays containing all of the entries in db columns for eraStyle and countries.
*/
router.get('/checkboxes', async function (req, res, next) {
	try {
		const checkboxData = await Work.getFormChoices();

		return res.json({ checkboxData })
	} catch (error) {
		return next(error);
	}
});


/** GET /:id => { work }
* 
*   Returns complete work details and associated comments
*   TODO: be specific about what is returned
*   
* 	No auth required.
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

/** POST /:userId
* 
*   Add a new work.
*   Required: title, compId.
*   Optional: duration, eraStyle, highestNote, lowestNote, difficulty, techniques, clef, compYr, accompType, accompDifficulty.
*   (NB: user chooses from a list of composers or may click a button for a form to add a new composer)
*/
router.post('/:userId', ensureCorrectUser, async function (req, res, next) {
    try {
		const validator = jsonschema.validate(req.body, workNewSchema);
		if (!validator.valid) {
			const errs = validator.errors.map(e => e.stack);
			throw new BadRequestError(errs);
     	}
		
		req.body.submittedBy = parseInt(req.params.userId);
        const newWorkId = await Work.addWork(req.body);

        return res.status(201).json({ newWorkId });
    } catch (error) {
        return next(error);
    }
});

/** PATCH /:id/:userId
*   Updates: title, compId, duration, eraStyle, highestNote, lowestNote, difficulty, techniques, clef, compYr, accompType, accompDifficulty
* 	Does NOT update: "submitted_by" (or "id").
*   All fields are required, except as noted.
*   TODO: what is returned?
*/
router.patch('/:id/:userId', ensureCorrectUserOrAdmin, async function (req, res, next) {
    try {
		const validator = jsonschema.validate(req.body, workUpdateSchema);
		if (!validator.valid) {
			const errs = validator.errors.map(e => e.stack);
			throw new BadRequestError(errs);
     	}

		req.params.id = parseInt(req.params.id);
		req.body.submittedBy = parseInt(req.params.userId);
        const newWorkId = await Work.updateWork(req.params.id, req.body);

        return res.status(201).json({ newWorkId });
    } catch (error) {
        return next(error);
    }
});

/** DELETE /:id/:submittedBy 
* 	submittedBy is a userId
* 	Returns { deleted: id }
*/
router.delete('/:id/:userId', ensureCorrectUserOrAdmin, async function (req, res, next) {
    try {
		req.params.id = parseInt(req.params.id);
        await Work.deleteWork(req.params.id);

        return res.json({ deleted: req.params.id });
    } catch (err) {
      	return next(err);
    }
});




module.exports = router;