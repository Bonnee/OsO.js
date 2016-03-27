var db = require('mysql');
var server = require('ws').Server;

var sockPort = 10611;

var socket = new server({
    port: sockPort
});

socket.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
    });
});