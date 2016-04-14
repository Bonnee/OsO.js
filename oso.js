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
            console.log("Received: " + message);
            message = JSON.parse(message);

            if (message.id == 'hello' && state == State.Connecting) { // Initial connection. Only accepted when state is 0
                db.exists(message.data, function(ex) {
                    if (!ex) {
                        state = State.Associating;
                        ws.sendJSON('who', '');
                        console.log("Device doesn't exist in db. Requesting data...");

                    } else { // Skip association
                        state = State.Connected;
                        console.log('Welcome back ' + message.data);
                    }
                    devId = message.data;
                });
            } else if (message.id == 'who' && state = State.Associating) { // Adds a new device in db
                state = State.Connected;
                db.addDevice(JSON.parse(message.data));
            } else if (message.id = 'data' && state = State.Connected) {

            }
        } else {
            console.log(address + ': ' + message.data);
        }
    });

ws.on('close', function close() {
    console.log(address + ' has disconnected.');
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
