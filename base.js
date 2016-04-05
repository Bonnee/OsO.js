var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/oso');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', function() {
    console.log('Connected to DB');
});

var schema = new db.Schema({
    _id: {
        type: String,
        lowercase: true
    },
    name: String,
    description: String,
    location: String,
    dateAdd: {
        type: Date,
        default: Date.now
    },
    settings: [Schema.Types.Mixed],
    data: [Schema.Types.Mixed]
}, {
    strict: false
});

schema.statics.exists = function exists(id) {
    this.count({
        _id: String
    }, function(e, count) {
        if (count > 0)
            return true;
        return false;
    })
}

var oso = mongoose.model('oso', schema);

mongoose.connect('mongodb://localhost/oso');
module.export(this);
