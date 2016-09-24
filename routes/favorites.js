'use strict';

const express = require('express');
const router = express.Router();
const knex = require('../knex');
const humps = require('humps');
const bcrypt = require('bcrypt');
const boom = require('boom');

const authorize = function(req, res, next) {
    if (!req.session.userInfo) {
        throw boom.create(401, 'Unauthorized')
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
    knex('books')
        .innerJoin('favorites', 'favorites.book_id', 'books.id')
        .where({
            'favorites.book_id': req.query.bookId,
            'user_id': req.session.userInfo.id
        })
        .first()
        .then((row) => {
            if (row) {
                return res.send(true);
            } else {

                res.send(false);
            }
        })
        .catch((err) => {
            next(err)
        })
});

router.post('/', authorize, (req, res, next) => {
    const insertFav = {
        book_id: req.body.bookId,
        user_id: req.session.userInfo.id
    };

    knex('favorites')
        .insert(humps.decamelizeKeys(insertFav), '*')

    .then((books) => {
            const favorite = humps.camelizeKeys(books[0])

            res.send(favorite)
        })
        .catch((err) => {
            next(err)
        })
})

router.delete('/', authorize, (req, res, next) => {
    const bookId = Number.parseInt(req.body.bookId);
    if (Number.isNaN(bookId)) {
        return next();
    }
    const userId = Number.parseInt(req.session.userInfo.id);
    if (Number.isNaN(userId)) {
        return next();
    }
    let delFav = {
        book_id: bookId,
        user_id: userId
    }
    delFav = humps.decamelizeKeys(delFav)
    let favorite;
    knex('favorites')
        .where(delFav)
        .first()
        .then((row) => {
            if (!row) {
                throw boom.create(404, 'Favorite not found');
            }
            favorite = humps.camelizeKeys(row)
            return knex('favorites')
                .del()
                .where('id', favorite.id)
        })
        .then(() => {
            delete favorite.id;
            res.send(favorite);
        })
        .catch((err) => {
            next(err);
        });
})

module.exports = router;
