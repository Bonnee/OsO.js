var wss = require('ws').Server;
var ev = require('events').EventEmitter;
var util = require('util');

this.server = function(p) {
    var self = this;

    var sv = new wss({
        port: p
    });

    sv.on('connection', function(ws) {
        ws.sendJSON = function(id, data) {
            ws.send(JSON.stringify({
                "id": id,
                "data": data
            }));
        };

        self.emit('connection', ws);

        ws.on('message', function(message) {
            self.emit('message', message);
            //self.emit(message.id, message.data);  // emits an event based on the id of the received message
        });

        ws.on('close', function() {
            self.emit('close');
        });
    });
}

util.inherits(this.server, ev);
module.exports = this;
ev.call(this);
