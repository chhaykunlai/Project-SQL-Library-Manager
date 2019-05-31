const express = require('express');
const bodyParser = require('body-parser');

const mainRoutes = require('./routes');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use('/static', express.static('public'));

// Setup view engine
app.set('view engine', 'pug');

app.use(mainRoutes);

app.use((req, res, next) => {
    const notFoundError = new Error('Not found');

    notFoundError.status = 404;
    next(notFoundError)
});

app.use((error, req, res, next) => {
    console.error('There is something wrong, ', error.message);
    res.status(error.status || 500);
    res.render('page-not-found');
});

app.listen(3000, () => {
    console.log('Service is starting on port 3000.');
});