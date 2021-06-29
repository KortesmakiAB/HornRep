'use strict';

const express = require('express');

const Work = require('../models/work');


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
*   TODO: include auth & validation
* 
*/
router.get('/', async function (req, res, next) {
    const q = req.query;
    try {
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
      const work = await Work.getWork(+req.params.id);
      return res.json({ work });
    } catch (err) {
      return next(err);
    }
});

/** POST /
* 
*   Add a new work.
*   TODO: what is required/optional?
*   TODO: what is returned?
*   (NB: user chooses from a list of composers or may click a button for a form to add a new composer)
*
*   TODO: include auth & validation
*/
router.post('/', async function (req, res, next) {
    try {
        const newWorkId = await Work.addWork(req.body);
        return res.status(201).json({ newWorkId });
    } catch (error) {
        return next(error);
    }
});

/** PATCH /:id
* 
*   Updates ALL fields, EXCEPT 'submittedBy' and 'id'(work).
*   All fields are required, except as noted.
*   TODO: what is returned?
*   TODO: include auth & validation
*/
router.patch('/:id', async function (req, res, next) {
    try {
        const newWorkId = await Work.updateWork(+req.params.id, req.body);
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
        await Work.deleteWork(+req.params.id);
        return res.json({ deleted: req.params.id });
      } catch (err) {
        return next(err);
      }
});



module.exports = router;