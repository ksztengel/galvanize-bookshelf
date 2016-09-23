'use strict';

const express = require('express');
const router = express.Router();
const knex = require('../knex');
const humps = require('humps')
const bcrypt = require('bcrypt');

// YOUR CODE HERE
router.post('/', (req, res, next) => {
  const hashedPassword = bcrypt.hashSync(req.body.password, 12)
    let user;
    let newObjUser = {
        first_name: req.body.firstName,
        last_name: req.body.lastName,
        email: req.body.email,
        hashed_password: hashedPassword,
    }
    console.log(newObjUser);

    knex(`users`)
        .insert(humps.decamelizeKeys(newObjUser),`id`)
        .then((num) => {
            const id = num[0];
            knex('users')
                .where(`id`, id)
                .first()
                .then((newObjUser) => {
                  user = humps.camelizeKeys(newObjUser)
                  delete user.hashedPassword
                    req.session.userInfo = newObjUser
                    res.json(user)
                    // redirect('/')
                })
        })
        .catch((err) => {
            next(err);
        });
});
module.exports = router;
