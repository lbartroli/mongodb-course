var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');

MongoClient.connect('mongodb://localhost:27017/video', (err, db) => {
    assert.equal(null, err);
    console.log('Successfully connected to the server');

    db.collection('movies').find().toArray((err, docs) => {
        docs.forEach(doc => {
            console.log(doc.title);
        });
        db.close();
    });

});