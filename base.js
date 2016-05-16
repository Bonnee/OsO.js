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

	var Devices = require('./models/device.js');

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
		var type = data.id;
		delete data.id;

		var update = {};
		update[type] = [data];

		console.log(update);

		Devices.findByIdAndUpdate(
			mac.toLowerCase(), {
				data: {
					update
				}
			},
			function(e, device) {
				if (e) console.log(e);
				else {
					console.log(device);
					//device.data[type].push(data);
				}
			}
		);
		return update.$push;
	}
}

module.exports = this.base;
