const express = require('express');
const router = express.Router();

const Book = require('../models').Book;

router.get('/', async (req, res) => {
    const books = await Book.findAll();
    res.render('index', { books });
});

router.get('/new', (req, res) => {
    res.render('new-book', { isNew: true });
});

router.post('/new', async (req, res) => {
    const data = req.body;
    try {
        await Book.create(data);
    } catch (error) {
        const valiationErrors = error.errors.map(validationError => {
            return validationError.message;
        });

        return res.render('new-book', { valiationErrors, book: data, isNew: true });
    }
    
    res.redirect('/');
});

router.get('/:id', async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    res.render('update-book', { book, isNew: false });
});

router.post('/:id', async (req, res) => {
    const data = req.body;
    let book;
    try {
        book = await Book.findByPk(req.params.id);

        await book.update(data);
    } catch (error) {
        const valiationErrors = error.errors.map(validationError => {
            return validationError.message;
        });

        return res.render('update-book', { valiationErrors, book, isNew: false });
    }
    
    req.body = {};
    res.redirect('/');
});

router.post('/:id/delete', async (req, res) => {
    let book;
    try {
        book = await Book.findByPk(req.params.id);

        await book.destroy();
    } catch (error) {
        console.error('There is something wrong during removing book, ' + error.message);

        return res.redirect(`/books/${req.params.id}`);
    }

    res.redirect('/');
});

module.exports = router;