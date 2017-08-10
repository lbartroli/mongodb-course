var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    engines = require('consolidate'),
    MongoClient = require('mongodb').MongoClient,
    assert = require('assert'),
    path = require('path');

app.engine('html', engines.nunjucks);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, '/views'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

function errorHandler(err, req, res, next) {
    console.error(err.message);
    console.error(err.stack);
    res.status(500);
    res.render('error_template', { error: err });
};

MongoClient.connect('mongodb://localhost:27017/video', (err, db) => {
    assert.equal(null, err);
    console.log('Successfully connected to the server');

    app.get('/', (req, res) => {
        db.collection('movies').find().toArray((err, docs) => {
            res.render('home', { movies: docs });
        });
    });

    app.get('/fruits', (req, res) => {
        res.render('fruits', { 'fruits': ['Manzana', 'Banana', 'Pera', 'Durazno'] });
    });

    app.post('/fruits', (req, res, next) => {
        var fruitSelected = req.body.fruits;
        console.log(fruitSelected);
        if(typeof fruitSelected == 'undefined') {
            next(Error('Please choose a fruit'));
        } else {
            res.render('fruit-selected', { fruitSelected: fruitSelected });
        }
    });

    app.get('/:name', (req, res) => {
        var name = req.params.name;
        var getvar1 = req.query.getvar1;
        var getvar2 = req.query.getvar2;
        res.render('hello', { name: name, getvar1: getvar1, getvar2: getvar2 });
    });

    app.use((req, res) => {
        res.sendStatus(404)
    });

    app.use(errorHandler);

    var server = app.listen(3000, () => {
        var port = server.address().port;
        console.log(`Server listening on port ${port}`);
    });
});