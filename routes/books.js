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
// router.post(`/books`, (req, res) => {
//   knex(`books`).insert(humps.decamelizeKeys(req.body), `id`).then((num) => {
//     const id = num[0];
//     knex(`books`).where(`id`, id).first().then((data) => {
//       res.json(humps.camelizeKeys(data));
//     });
//   });
// });
router.post('/books', (req, res, next) => {
    let insertBook = {
        title: req.body.title,
        author: req.body.author,
        genre: req.body.genre,
        description: req.body.description,
        cover_url: req.body.coverUrl
    }
    res.set('Content-Type', 'application/json')
    knex(`books`).insert(humps.decamelizeKeys(insertBook), `id`).then((num) => {
      const id = num[0];
    knex('books')
        // .insert(humps.decamelizeKeys(insertBook))
        // .then(() => {
            .where(`id`, id).first().then((insertBook)=>{
            res.json(humps.camelizeKeys(insertBook))
        })
      // })
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
        cover_url: req.body.cover_url
    }
    console.log("inserting...", updateBook)
    res.set('Content-Type', 'application/json')
    knex('books')
        .where('books.id', req.params.id)
        .first()
        .then((book) => {
            if (!book) {
                return next();
            }

            return knex('books')
                .update(updateBook)
                .where('books.id', req.params.id);
        })
        .then((books) => {
            res.redirect('/');
            // res.send(books[0]);
        })
        .catch((err) => {
            next(err);
        });
});

router.delete('/:id', (req, res, next) => {
    res.set('Content-Type', 'application/json') 
    knex('books')
        .where('books.id', req.params.id)
        .first()
        .then((row) => {
            if (!row) {
                return next();
            }
            let book = row;
            return knex('books')
                .del()
                .where('books.id', req.params.id);
        })
        .then(() => {
            delete books.id;
            // res.redirect('/');
            res.send(books);
        })
        .catch((err) => {
            next(err);
        });
});

module.exports = router;
