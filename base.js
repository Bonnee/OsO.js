var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/oso');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', function() {
  console.log('Connected to DB');
});

var deviceSchema = new db.Schema({
    _id: { type: String, lowercase: true },
    name: String,
    description: String,
    location: String,
    dateAdd: { type: Date, default: Date.now },
    settings: [{ name: String, value: String }]
});

var Device = mongoose.model('Device', deviceSchema);
