'use strict';

const express = require('express');
const router = express.Router();
const knex = require('../knex');
const humps = require('humps')

// YOUR CODE HERE
router.get('/', (_req, res, next) => {
    knex('books')
        .orderBy('title')
        .then(books => {
            res.send(humps.camelizeKeys(books))
        })
        .catch((err) => {
            next(err);
        });
});

router.get('/:id', (req, res, next) => {
    knex('books')
        .where('books.id', req.params.id)
        .first()
        .then((book) => {
            if (!book) {
                return next();
            }
            res.send(humps.camelizeKeys(book));
        })
        .catch((err) => {
            next(err);
        });
});

router.post('/', (req, res, next) => {
    let insertBook = {
        title: req.body.title,
        author: req.body.author,
        genre: req.body.genre,
        description: req.body.description,
        cover_url: req.body.coverUrl
    }
    knex(`books`).insert(humps.decamelizeKeys(insertBook), `id`).then((num) => {
            const id = num[0];
            knex('books')
                .where(`id`, id).first().then((insertBook) => {
                    res.json(humps.camelizeKeys(insertBook))
                })
        })
        .catch((err) => {
            next(err);
        });
});

router.patch('/:id', (req, res, next) => {
    let updateBook = {
        title: req.body.title,
        author: req.body.author,
        genre: req.body.genre,
        description: req.body.description,
        cover_url: req.body.coverUrl
    }
    knex(`books`)
        .update(humps.decamelizeKeys(updateBook), '*').then((book) => {
            knex('books')
                .where(`id`, book[0].id).first().then((newBook) => {
                    res.json(humps.camelizeKeys(newBook))
                })
        })
        .catch((err) => {
            next(err);
        });
});
router.delete('/:id', (req, res, next) => {
    const id = Number.parseInt(req.params.id);
    if (Number.isNaN(id)) {
        return next();
    }
    let book;
    knex('books')
        .where('id', id)
        .first()
        .then((row) => {
            if (!row) {
                return next();
            }
            book = humps.camelizeKeys(row);
            return knex('books')
                // .returning('*')
                .del()
                .where('id', id);
        })
        .then(() => {
            delete book.id;
            res.json(book);
        })
        .catch((err) => {
            next(err);
        });
});

module.exports = router;
