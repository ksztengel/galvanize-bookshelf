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
            res.send(books)
          humps.camelizeKeys(books)
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

            res.send(book);
        })
        .catch((err) => {
            next(err);
        });
});
// router.post('/books', (req, res, next) => {
//     knex('books')
//         .insert({
//             name: req.body.name
//         }, '*')
//         .then((books) => {
//
//             res.send(books[0]);
//         })
//         .catch((err) => {
//             next(err);
//         });
// });
// router.patch('/books/:id', (req, res, next) => {
//     knex('books')
//         .where('id', req.params.id)
//         .first()
//         .then((book) => {
//             if (!book) {
//                 return next();
//             }
//
//             return knex('books')
//                 .update({
//                     name: req.body.name
//                 }, '*')
//                 .where('id', req.params.id);
//         })
//         .then((books) => {
//
//             res.send(books[0]);
//         })
//         .catch((err) => {
//             next(err);
//         });
// });
// // router.delete('/books/:id', (req, res, next) => {
//   let book;
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
//

module.exports = router;
