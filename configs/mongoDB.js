const MongoClient = require('mongodb').MongoClient
const url = 'mongodb://localhost:27017'
var db

MongoClient.connect(url, (err,database) => {
    if (err) return console.error(err);
    console.log('mongodb connected');
    db=database.db(process.env.DATABASE)
});

module.exports.get= ()=> {
    return db
}
