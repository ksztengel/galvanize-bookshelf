'use strict';

const express = require('express');
const router = express.Router();
const knex = require('../knex');
// YOUR CODE HERE
router.get('/books', (_req, res, next) => {
    knex('books')
        .orderBy('id')
        .then((books) => {
            res.set('Content-Type', 'application/json');
            res.send(books);
        })
        .catch((err) => {
            next(err);
        });
});

router.get('/books/:id', (req, res, next) => {
    knex('books')
        .where('id', req.params.id)
        .first()
        .then((book) => {
            if (!Books) {
                return next();
            }
            res.set('Content-Type', 'application/json');
            res.send(book);
        })
        .catch((err) => {
            next(err);
        });
});
router.post('/books', (req, res, next) => {
    knex('books')
        .insert({
            name: req.body.name
        }, '*')
        .then((books) => {
            res.set('Content-Type', 'application/json');
            res.send(books[0]);
        })
        .catch((err) => {
            next(err);
        });
});
router.patch('/books/:id', (req, res, next) => {
    knex('books')
        .where('id', req.params.id)
        .first()
        .then((book) => {
            if (!book) {
                return next();
            }

            return knex('books')
                .update({
                    name: req.body.name
                }, '*')
                .where('id', req.params.id);
        })
        .then((books) => {
            res.set('Content-Type', 'application/json');
            res.send(books[0]);
        })
        .catch((err) => {
            next(err);
        });
});
// router.delete('/books/:id', (req, res, next) => {
//   let artist;
//
//   knex('books')
//     .where('id', req.params.id)
//     .first()
//     .then((row) => {
//       if (!row) {
//         return next();
//       }
//
//       book = row;
//
//       return knex('book')
//         .del()
//         .where('id', req.params.id);
//     })
//     .then(() => {
//       delete book.id;
//       res.send(book);
//     });
//     .catch((err) => {
//       next(err);
// });
// });

module.exports = router;
