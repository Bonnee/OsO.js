var mongoose = require('mongoose');
var db = mongoose.connection;
var Schema = mongoose.Schema;

this.base = function(addr, name) {
    var self = this;
    var conn = 'mongodb://' + addr + '/' + name;
    mongoose.connect(conn);

    db.on('error', console.error.bind(console, 'Connection error:'));
    db.once('open', function() {
        console.log('Connected to ' + conn);
    });

    var schema = new Schema({
        mac: {
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
        connected: Boolean,
        settings: [Schema.Types.Mixed],
        data: [Schema.Types.Mixed]
    }, {
        strict: false
    });

    schema.statics.exists = function(addr, back) {
        addr = addr.toLowerCase();

        this.find({
            mac: addr
        }, function(e, doc) {
            if (doc.length > 0)
                back(true);
            else
                back(false);
        })
    }

    var Model = mongoose.model('devices', schema);

    this.addDevice = function(manifest) {
        var device = new Model(manifest);
        device.save(device, function(e, data) {
            //console.log(data);
        });
    }

    this.exists = function(mac, back) {
        return Model.exists(mac, back);
    }
}

module.exports = this.base;
