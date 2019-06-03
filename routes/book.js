const express = require('express');
const Sequelize = require('sequelize');
const router = express.Router();

const Book = require('../models').Book;

router.get('/', async (req, res) => {
    const queryObj = req.query;
    const { like } = Sequelize.Op;
    let pagination = {
        currentPage: 1,
        currentIndex: 0,
        limit: 12,
        offset: 0,
        hasPrev: false,
        nextUrl: '',
        hasNext: false,
        prevUrl: '',
        totalCount: 0,
        availablePages: 0,
        totalPages: 0
    };
    let conditions = {};

    if (queryObj.title) {
        conditions.title = {
            [like]: `%${queryObj.title}%`
        };
    }

    if (queryObj.author) {
        conditions.author = {
            [like]: `%${queryObj.author}%`
        };
    }

    if (queryObj.genre) {
        conditions.genre = {
            [like]: `%${queryObj.genre}%`
        };
    }

    if (queryObj.year) {
        conditions.year = queryObj.year;
    }

    pagination.currentPage = queryObj.page ? parseInt(queryObj.page) : 1;

    const totalBooksPerPage = (pagination.currentPage * pagination.limit);

    pagination.offset = totalBooksPerPage - pagination.limit;
    
    const books = await Book.findAndCountAll({
        where: conditions,
        limit: pagination.limit,
        offset: pagination.offset
    });

    const queryArray = Object.entries(queryObj).reduce((results, item) => {
        if (item && item[0] !== 'page') {
            results.push(item.join('='));
        }
        return results;
    }, []);

    pagination.totalCount = books ? books.count : 0;
    pagination.hasNext = pagination.totalCount > totalBooksPerPage;
    pagination.hasPrev = totalBooksPerPage > pagination.limit;
    pagination.nextUrl = `/books?${queryArray.join('&')}&page=${pagination.currentPage + 1}`;
    pagination.prevUrl = `/books?${queryArray.join('&')}&page=${pagination.currentPage - 1}`;
    pagination.totalPages = Math.ceil(pagination.totalCount / (totalBooksPerPage - pagination.limit));
    res.render('index', { books, query: queryObj, queryString: `/books?${queryArray.join('&')}`, pagination });
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

        return res.render('error');
    }

    res.redirect('/');
});

module.exports = router;