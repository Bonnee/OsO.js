var wss = require('ws').Server;
var ev = require('events').EventEmitter;
var util = require('util');

this.server = function (p) {
    var self = this;

    var sv = new wss({
        port: p
    });

    sv.on('connection', function connection(ws) {
        self.emit('connection', ws);
        //console.log('Connection from: ' + ws._socket.remoteAddress + ':' + ws._socket.remotePort);
        //ws.send('welcome');

        ws.on('message', function incoming(message) {
            self.emit('message', message);
            //console.log(ws._socket.remoteAddress + ':' + ws._socket.remotePort + ': ' + message);
            //ws.send(message);
        });

        ws.on('close', function () {
            self.emit('close');
        });
    });
}

util.inherits(this.server, ev);
module.exports = this;
ev.call(this);
