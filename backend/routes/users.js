'use strict';

const express = require('express');
const jsonschema = require('jsonschema');

const User = require('../models/user');
const { BadRequestError } = require('../expressError');
const { createToken } = require('../helpers/token');

const userRegisterSchema = require('../schemas/userRegister');
const userUpdateSchema = require('../schemas/userUpdate');
const userAuthSchema = require('../schemas/userAuth');

const router = new express.Router();


/////////////                           /users routes                      ///////////// 


/** GET /:id
* 
*   id => { user: { username, fName, lName, email, password, category, isAdmin }}
* 
*   TODO Auth: ensureCorrectUserOrAdmin
* 
*/
router.get('/:id', async function (req, res, next) {
    try {
        req.params.id = parseInt(req.params.id);
		
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
        const token = createToken(newUser);
        return res.status(201).json({ token });
    } catch (error) {
        return next(error);
    }
});

/** PATCH /:id
* 
*   Updates (required): username, fName, lName, email, category, password.
*   
*   Does not update: isAdmin.
*
*   Returns { newUserId: int }
*
*   TODO Auth: ensureLoggedIn
*/
router.patch('/:id', async function (req, res, next) {
    try {
        req.params.id = parseInt(req.params.id);
		
        const validator = jsonschema.validate(req.body, userUpdateSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }

        const newUserId = await User.updateUser(req.params.id, req.body);
        return res.status(201).json({ newUserId });
    } catch (error) {
        return next(error);
    }
});

/** DELETE /:id
*   TODO Auth: ensureLoggedIn
*/
router.delete('/:id', async function (req, res, next) {
    try {
        req.params.id = parseInt(req.params.id);
		
        await User.deleteUser(req.params.id);
        return res.json({ deleted: req.params.id });
    } catch (err) {
        return next(err);
    }
});

/** POST /token  { username, password } => { token }
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
  
      const { username, password } = req.body;
      const user = await User.authenticate(username, password);
      const token = createToken(user);
      return res.json({ token });
    } catch (err) {
      return next(err);
    }
  });



module.exports = router;