var io = require('socket.io')();
var fs = require('fs');

this.Server = function(port, db) {

	io.on('connection', function(device) {
		var state = State.Connecting;
		var devId;

		console.log('Connection');

		device.on('hello', function(data) {
			state = State.Connected;
			db.exists(data, function(response, dev) {
				devId = data.toLowerCase();
				if (response) { // Skip association
					state = State.Connected;
					device.emit('hello', dev.name);
					console.log(JSON.stringify(dev.name) + ' recognized.');
				} else { // Asks for manifest
					state = State.Pairing;
					device.emit('pair', data);
					console.log(data + ' does not exist in db. Requesting data...');
				}
			});
		});

		device.once('pair', function(data) {
			state = State.Pairing;
			db.addDevice(devId, data, function(dev, err) {
				device.emit('hello', dev.name);

				console.log(dev.name + ' added.');
			});

			fs.mkdir(__dirname + '/public/devices/' + devId, function(e) {
				device.emit('dashboard', devId);
				if (e)
					console.log(e)
				else
					console.log('Created ' + devId + ' directory.');
			});
		});

		device.on('dashboard', function(data) {
			var path = __dirname + '/public/devices/' + devId + '/' + data.path;

			console.log(path + " - dir: " + data.dir);

			if (data.dir) {
				fs.stat(path, function(err, stat) {
					if (!stat) {
						fs.mkdir(path);
					}
				});
			} else {
				fs.writeFile(path, data.file);
			}
		});

		device.on('log', function(data) {
			console.log("[" + devId + "]:", data);
			db.addRecord(devId, data);
		});

		device.on('warning', function(data) {
			if (data.value == 1) {
				db.find(devId, function(dev) {
					console.log("[WARNING][" + dev.name + "] " + data.id + " raised an alarm");
				});
			} else {
				db.find(devId, function(dev) {
					console.log("[WARNING][" + dev.name + "] " + data.id + " stopped an alarm");
				});
			}
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
