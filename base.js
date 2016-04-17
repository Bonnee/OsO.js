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
		connected: Boolean,
		settings: [Schema.Types.Mixed],
		data: [Schema.Types.Mixed]
	}, {
		strict: false
	});

	schema.statics.exists = function(mac, back) {
		mac = mac.toLowerCase();

		this.find({
			_id: mac
		}, function(e, doc) {
			if (doc.length > 0)
				back(true);
			else
				back(false);
		});
	}

	var Model = mongoose.model('devices', schema);

	this.exists = function(mac, back) {
		return Model.exists(mac, back);
	}

	this.addDevice = function(mac, manifest) {
		var device = new Model(manifest);
		device._id = mac;
		device.save(device, function(e, data) {
			if (e)
				console.log(e);
		});
	}

	this.addRecord = function(mac, message) {
		Model.findByIdAndUpdate(
			mac.toLowerCase(), {
				$push: {
					"data": {
						timestamp: message.timestamp,
						data: message.data
					}
				}
			},
			function(e, model) {
				if (e) console.log(e);
				console.log(model);
			}
		);
	}
}

module.exports = this.base;