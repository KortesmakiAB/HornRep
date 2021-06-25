"use strict";

const express = require('express');

const Work = require('../models/work');


const router = new express.Router();

/** GET /works => { works: [{ work details }, ...]}
* 
*	Search fields - all optional:
*	{ 
*	  title, duration, difficulty, fName, lName, gender, 
*	  country, accompType, eraStyle, highestNote, 
*	  lowestNote, techniques, accompDifficulty,
*	}
* 
*   Note formats:
*   "HH:MM:SS": minDuration, maxDuration
*   array []: accompanimentType, techniques, country, eraStyle
*   integer: highestNote, lowestNote
*
*   If no search fields included, will return all works
* 
*   TODO: include auth
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

/** GET /works/[id] => { work }
* 
* Returns complete work details and associated comments
* 
*   TODO: include auth
* 
*/
router.get('/:id', async function (req, res, next) {
    try {
      const work = await Work.getWork(req.params.id);
      return res.json({ work });
    } catch (err) {
      return next(err);
    }
});

/** POST /works/new
* 
* user chooses from a list of composers or may click a button for a form to add a new composer
*/
router.post('/new', async function (req, res, next) {
    try {
        const newWorkId = await Work.addWork(req.body);
        return res.status(201).json({ newWorkId });
    } catch (error) {
        return next(error);
    }
});
module.exports = router;