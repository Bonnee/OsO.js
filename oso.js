process.stdout.write("Starting server...");

var sockPort = 11111;

var sv = new require('./socket.js').server;

var server = new sv(sockPort);

var base = require('./base.js');
var db = new base('localhost', 'oso');

server.on('connection', function (ws) {
    var address = ws._socket.remoteAddress + ':' + ws._socket.remotePort;
    console.log('Connection from: ' + address);

    ws.on('message', function (message) {
        console.log("Received: " + message);
        message = JSON.parse(message);

        if (message.id == 'hello') { // Initial connection
            db.exists(message.data, function (ex) {
                console.log(ex);
                if (!ex) {
                    ws.sendJSON('who', '');
                    console.log("Device doesn't exist in db. Requesting data...");
                } else {
                    console.log('Welcome back ' + message.data);
                }
            });
        } else if (message.id == 'who') { // If device doesn't exists
            db.addDevice(JSON.parse(message.data));
        } else {
            console.log(address + ': ' + message.data);
        }
    });

    ws.on('close', function close() {
        console.log(address + ' has disconnected.');
    });

    function send(connection, data, id) {
        var pkt = {
            'id': id
            , 'data': data
        }
        connection.send(JSON.stringify(pkt));
    }
});


/*

this.server = function (port) {
    ev.call(this);

    var wss = new ws.Server({
        port: port
    });

    wss.broadcast = function (data) {
        for (var i in this.clients)
            send(this.clients[i], data, 'upd');
    }

    wss.on('connection', function (ws) {
        console.log('conn');
        this.emit('conn', ws);

        ws.on('message', function (data) {
            console.log('data');
            this.emit('data', data);
        });
    });
}*/

console.log('started.');