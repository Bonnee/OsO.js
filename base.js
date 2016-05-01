var mongoose = require('mongoose');
var db = mongoose.connection;
//var Schema = mongoose.Schema;

this.base = function(addr, name) {
	var self = this;
	var conn = 'mongodb://' + addr + '/' + name;
	mongoose.connect(conn);

	db.on('error', console.error.bind(console, 'Connection error:'));
	db.once('open', function() {
		console.log('db is ' + conn);
	});

	var Devices = require('./models/devices.js');

	this.exists = function(mac, back) {
		return Devices.exists(mac, back);
	}

	this.find = function(id, back) {
		Devices.find({
			_id: id.toLowerCase()
		}, function(e, doc) {
			return back(doc[0]);
		});
	}

	this.addDevice = function(mac, manifest, back) {
		manifest["_id"] = mac;
		Devices.create(manifest, function(err, res) {
			if (err) return err;
			else back(res);
		});
	}

	this.addRecord = function(mac, data) {
		var update = {
			$push: {}
		};
		var type = data.id;
		delete data.id;
		update.$push[type] = data;

		Devices.findByIdAndUpdate(
			mac.toLowerCase(),
			update,
			function(e, model) {
				if (e) console.log(e);
			}
		);
		return update.$push;
	}
}

module.exports = this.base;
