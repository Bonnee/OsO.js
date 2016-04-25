var io = require('socket.io')();
var ev = require('events').EventEmitter;
var util = require('util');

this.Server = function(port, db) {
	var self = this;

	io.on('connection', function(device) {
		var state = State.Connecting;
		var devId;

		console.log('Connection');

		device.on('hello', function(data) {
			console.log(data);
			db.exists(data, function(ex, dev) {
				devId = data;
				if (ex) { // Skip association
					state = State.Connected;
					device.emit('hello', dev.name);
					console.log(JSON.stringify(dev.name) + ' recognized.');
				} else { // Asks for manifest
					state = State.Associating;
					device.emit('pair', devId);
					console.log(data + ' does not exist in db. Requesting data...');
				}
			});
		});

		device.on('pair', function(data) {
			state = State.Connected;
			var dev = db.addDevice(devId, data);
			device.emit('hello', dev.name);
			console.log(dev.name + ' added.');
		});

		device.on('log', function(data) {
			console.log(db.addRecord(devId, data));
		});

		device.on('warning', function(data) {
			if (data.value == 1)
				db.find(devId, function(dev) {
					console.log(dev);
					console.log("[WARNING][" + dev.name + "] " + data.id + " raised an alarm");
				})
		})

		device.on('message', function(data) {
			console.log(data);
		})

		device.on('close', function close() {
			console.log(devId + ' has disconnected.');
		});
	});
	io.listen(port);
}

var State = {
	Connecting: 0,
	Associating: 1,
	Connected: 2,
	Exchange: 3,
	Error: 4
}

//util.inherits(this.Server, ev);

//ev.call(this);
module.exports = this.Server;
