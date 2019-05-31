const express = require('express');
const router = express.Router();

const db = require('../models');

router.get('/', (req, res) => {
    res.redirect('/books');
});

router.get('/books', async (req, res) => {
    const books = await db.Book.findAll();
    res.render('index', { books });
});

router.get('/books/new', (req, res) => {
    res.render('new-book');
});

router.post('/books/new', async (req, res) => {
    const data = req.body;
    db.Book.create({
        title: data.title ? data.title : null,
        author: data.author ? data.author : null,
        genre: data.genre ? data.genre : null,
        year: data.year ? data.year : null
    })
        .catch(errors => {
            for (let error in errors) {
                console.dir(errors[error]);
            }
        });

    //res.redirect('/');
});

router.get('/books/:id', async (req, res) => {
    const book = await db.Book.findOne({ where: { id: req.params.id } });
    res.render('update-book', { book });
});

router.post('/books/:id', (req, res) => {

});

router.post('/books/:id/delete', (req, res) => {

});

module.exports = router;