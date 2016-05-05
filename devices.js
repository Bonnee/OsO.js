var io = require('socket.io')();

this.Server = function(port, db) {

	io.on('connection', function(device) {
		var state = State.Connecting;
		var devId;

		console.log('Connection');

		device.on('hello', function(data) {
			state = State.Connected;
			console.log(data);
			db.exists(data, function(ex, dev) {
				devId = data;
				if (ex) { // Skip association
					state = State.Connected;
					device.emit('hello', dev.name);
					console.log(JSON.stringify(dev.name) + ' recognized.');
				} else { // Asks for manifest
					state = State.Pairing;
					device.emit('pair', devId);
					console.log(data + ' does not exist in db. Requesting data...');
				}
			});
		});

		device.once('pair', function(data) {
			state = State.Pairing;
			db.addDevice(devId, data, function(dev) {
				device.emit('hello', dev.name);
				console.log(dev.name + ' added.');
			});
		});

		device.on('log', function(data) {
			console.log("[" + devId + "]:", data);
			db.addRecord(devId, data);
		});

		device.on('warning', function(data) {
			if (data.value == 1)
				db.find(devId, function(dev) {
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
	Pairing: 1,
	Connected: 2,
	Error: 3
}

module.exports = this.Server;
