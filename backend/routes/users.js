'use strict';

const express = require('express');
const jsonschema = require('jsonschema');

const User = require('../models/user');
const { BadRequestError } = require('../expressError');

const userRegisterSchema = require('../schemas/userRegister');
const userUpdateSchema = require('../schemas/userUpdate');

const router = new express.Router();


/////////////                           /users routes                      ///////////// 


/** GET /:id
* 
*   id => { user: { username, fName, lName, email, password, category, isAdmin }}
* 
*   TODO: include auth
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
*   Required: username, fName, lName, email, password, isAdmin.
*   Optional: category
*
*   Returns { newUserId: int }
*
*   TODO: include auth
*/
router.post('/', async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, userRegisterSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }

        const newUserId = await User.registerUser(req.body);
        return res.status(201).json({ newUserId });
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
*   TODO: include auth 
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
*   TODO add auth
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



module.exports = router;