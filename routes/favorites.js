'use strict';

const express = require('express');
const router = express.Router();
const knex = require('../knex');
const humps = require('humps');
const bcrypt = require('bcrypt');
const boom = require('boom');

const authorize = function()

router.get('/', (req, res, next) => {
    knex('favorites')
        .innerJoin('books', 'books.id', 'favorites.book_id')
        .where('user_id', req.session.userInfo.id)
        .orderBy('books.title')
        .then((books) => {
            res.send(humps.camelizeKeys(books))
        })
        .catch((err) => {
            next(err);
        });
});

router.get('/:id', (req, res, next) => {
    knex('favorites')
        .innerJoin('books', 'books.id', 'favorites.book_id')
        .where('user_id', req.session.userInfo.id)
        .first()
        .then((row) => {
            if (row) {
                res.send(true);
            } else {

              res.send(false);
            }
        })
        .catch((err) => {
            next(err)
        })
});


module.exports = router;
