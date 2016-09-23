'use strict';

const express = require('express');
const router = express.Router();
const knex = require('../knex');
const humps = require('humps');
const bcrypt = require('bcrypt');
const boom = require('boom');

router.get('/', (_req, res, next) => {
    knex('favorites')
        .then((books) =>{
        res.send(books)
      })
            
        .catch((err) => {
            next(err);
        });
});
module.exports = router;
