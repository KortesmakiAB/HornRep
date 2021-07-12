'use strict';

const express = require('express');
const jsonschema = require('jsonschema');

const User = require('../models/user');
const { ensureCorrectUser } = require('../middleware/auth');
const { BadRequestError } = require('../expressError');
const createToken = require('../helpers/token');

const userRegisterSchema = require('../schemas/userRegister');
const userUpdateSchema = require('../schemas/userUpdate');
const userAuthSchema = require('../schemas/userAuth');

const router = new express.Router();


/////////////                           /users routes                      ///////////// 


/** GET /:userId
* 
*   id => { user: { username, fName, lName, email, password, category, isAdmin }}
*/
router.get('/:userId', ensureCorrectUser, async function (req, res, next) {
    try {
        req.params.id = parseInt(req.params.userId);
		
        const user = await User.getUser(req.params.id);
        return res.json({ user });
    } catch (err) {
        return next(err);
    }
});

/** POST /
*   
*   Register a user
*
*   Required: { username, fName, lName, email, password }
*   Optional: { category }
*
*   Returns { token }
*
*   No auth required
*/
router.post('/', async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, userRegisterSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }

        const newUserId = await User.registerUser(req.body);
        const token = createToken({ id: newUserId });
        return res.status(201).json({ token });
    } catch (error) {
        return next(error);
    }
});

/** PATCH /:userId
* 
*   Updates (required): username, fName, lName, email, category, password.
*   
*   Does not update: isAdmin.
*
*   Returns { newUserId: int }
*/
router.patch('/:userId', ensureCorrectUser, async function (req, res, next) {
    try {
        req.params.userId = parseInt(req.params.userId);
		
        const validator = jsonschema.validate(req.body, userUpdateSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }

        const newUserId = await User.updateUser(req.params.userId, req.body);
        return res.status(201).json({ newUserId });
    } catch (error) {
        return next(error);
    }
});

/** DELETE /:userId
*
*/
router.delete('/:userId', ensureCorrectUser, async function (req, res, next) {
    try {
        req.params.userId = parseInt(req.params.userId);
		
        await User.deleteUser(req.params.userId);
        return res.json({ deleted: req.params.userId });
    } catch (err) {
        return next(err);
    }
});

/** POST /token  { email, password } => { token }
 *
 *  Returns JWT token which can be used to authenticate further requests.
 *
 *  Authorization required: none
 */

 router.post("/token", async function (req, res, next) {
    try {
      const validator = jsonschema.validate(req.body, userAuthSchema);
      if (!validator.valid) {
        const errs = validator.errors.map(e => e.stack);
        throw new BadRequestError(errs);
      }
  
      const { email, password } = req.body;
      const user = await User.authenticate(email, password);
      const token = createToken(user);
      return res.json({ token });
    } catch (err) {
      return next(err);
    }
  });



module.exports = router;