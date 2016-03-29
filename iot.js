process.stdout.write("Starting server...");

var sockPort = 10611;

var db = require('mysql');
var server = new require('./socket.js').server(sockPort);

server.on('connection', function (ws) {
    console.log('Connection from: ' + ws._socket.remoteAddress + ':' + ws._socket.remotePort);

    ws.on('data', function (message) {
        console.log(ws._socket.remoteAddress + ':' + ws._socket.remotePort + ': ' + message);
        if (message == 'levHistory') {
            send(ws, JSON.stringify(readFile(logPath)), 'req');
        }
    });

    ws.on('close', function close() {
        console.log(ws._socket.remoteAddress + ': ' + ws._socket.remotePort + 'disconnected.');
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