var mongoose = require('mongoose');
var db = mongoose.connection;
var Schema = mongoose.Schema;

this.base = function(addr, name) {
	var self = this;
	var conn = 'mongodb://' + addr + '/' + name;
	mongoose.connect(conn);

	db.on('error', console.error.bind(console, 'Connection error:'));
	db.once('open', function() {
		console.log('db is ' + conn);
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
		settings: [Schema.Types.Mixed]
	}, {
		strict: false
	});

	schema.statics.exists = function(mac, back) {
		mac = mac.toLowerCase();

		this.find({
			_id: mac
		}, function(e, doc) {
			if (doc.length > 0)
				back(true, doc[0]);
			else
				back(false, doc);
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
		return device;
	}

	this.addRecord = function(mac, message) {
		var update = {
			$push: {}
		};
		var type = message.type;
		delete message.type;
		update.$push[type] = message;


		Model.findByIdAndUpdate(
			mac.toLowerCase(),
			update,
			function(e, data) {
				if (e) console.log(e);
				model = data;
			}
		);
		return update.$push;
	}
}

module.exports = this.base;
