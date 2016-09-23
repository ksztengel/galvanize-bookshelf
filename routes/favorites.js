'use strict';

const express = require('express');
const router = express.Router();
const knex = require('../knex');
const humps = require('humps');
const bcrypt = require('bcrypt');
const boom = require('boom');

router.get('/favorites', function(req, res, next) {
    if (req.session.userInfo) {
        res.send(true)
    } else {
        res.send(false)
    }
})
module.exports = router;
