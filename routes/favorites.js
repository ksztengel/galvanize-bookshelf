'use strict';

const express = require('express');
const router = express.Router();
const knex = require('../knex');
const humps = require('humps');
const bcrypt = require('bcrypt');
const boom = require('boom');

const authorize = function(req, res, next){
  if (!req.session.userInfo){
    throw boom.create(401,'Unauthorized')
  }
  next()
}

router.get('/', authorize, (req, res, next) => {
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

router.get('/:id', authorize, (req, res, next) => {
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
