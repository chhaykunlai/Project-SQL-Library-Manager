const express = require('express');
const bodyParser = require('body-parser');

const mainRoutes = require('./routes');
const bookRoutes = require('./routes/book');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use('/static', express.static('public'));

// Setup view engine
app.set('view engine', 'pug');

// Routes
app.use(mainRoutes);
app.use('/books', bookRoutes);

// Not found middleware
app.use((req, res, next) => {
    const notFoundError = new Error('Not found');

    notFoundError.status = 404;
    next(notFoundError)
});

// Handles error
app.use((error, req, res, next) => {
    if (error) {
        console.error('There is something wrong, ', error.message);
        res.status(error.status || 500);

        switch (error.status) {
            case 404:
                res.render('page-not-found');
                break;
            case 505:
            default:
                res.render('error');
        }
    }
});

app.listen(3000, () => {
    console.log('Service is starting on port 3000.');
});