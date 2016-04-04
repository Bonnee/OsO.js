var db = require('mongoose');

var schema = new db.Schema({
    _id: String,
    name: String,
    description: String,
    location: String,
    dateAdd: Date,
    settings: [{ name: String, value: String }]
});
