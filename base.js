var mongoose = require('mongoose');
var db = mongoose.connection;
var Schema = mongoose.Schema;

this.base = function(addr, name) {
    var self = this;
    var conn='mongodb://' + addr + '/' + name;
    
    mongoose.connect(conn);
    db.on('error', console.error.bind(console, 'Connection error:'));
    db.once('open', function() {
        console.log('Connected to '+conn);
    });

    var schema = new Schema({
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

    this.addDevice = function(manifest) {
        var d = new oso(manifest);
        d.save(function(err, data) {
            if (err)
                console.log(err);
        });
    }
}

module.exports = this.base;
