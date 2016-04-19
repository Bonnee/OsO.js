process.stdout.write("Starting server...");

var sockPort = 11111;

var sv = new require('./socket.js').server;

var server = new sv(sockPort);

var base = require('./base.js');
var db = new base('localhost', 'oso');

server.on('connection', function(ws) {
	var address = ws._socket.remoteAddress + ':' + ws._socket.remotePort;
	var state = State.Connecting;
	var devId;

	console.log('Connection from: ' + address);

	ws.on('message', function(message) {
		//console.log("Received: " + message);
		message = JSON.parse(message);

		if (message.id == 'hello' && state == State.Connecting) { // Initial connection. Only accepted when state is 0
			db.exists(message.data, function(ex, dev) {
				devId = message.data;
				//console.log(dev);
				if (ex) { // Skip association
					state = State.Connected;
					ws.sendJSON('welcome', dev.name);
					console.log(JSON.stringify(dev.name) + ' recognized.');
				} else { // Asks for manifest
					state = State.Associating;
					ws.sendJSON('who', '');
					console.log(message.data + ' does not exist in db. Requesting data...');
				}
			});
		} else if (message.id == 'who' && state == State.Associating) { // Adds a new device in db
			state = State.Connected;
			var dev = db.addDevice(devId, JSON.parse(message.data));
			ws.sendJSON('welcome', dev.name);
			console.log(dev.name + ' added.');

		} else if (message.id = 'log' && state == State.Connected) {
			console.log(db.addRecord(devId, JSON.parse(message.data)));
		} else {
			console.log(devId + ': ' + message.data);
		}
	});

	ws.on('close', function close() {
		console.log(devId + ' has disconnected.');
	});

	function send(connection, data, id) {
		var pkt = {
			'id': id,
			'data': data
		}
		connection.send(JSON.stringify(pkt));
	}
});

var State = {
	Connecting: 0,
	Associating: 1,
	Connected: 2,
	Exchange: 3,
	Error: 4
}

console.log('started.');