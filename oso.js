process.stdout.write("Starting server...");

var sockPort = 11111;

process.stdout.write('loading socket...');
var devs = require('./devices.js');

process.stdout.write('loading database...');
var base = require('./base.js');
var db = new base('localhost', 'oso');

/*
     _            _          _____
    | |          (_)        /  ___|
  __| | _____   ___  ___ ___\ `--.  ___ _ ____   _____ _ __
 / _` |/ _ \ \ / / |/ __/ _ \`--. \/ _ \ '__\ \ / / _ \ '__|
| (_| |  __/\ V /| | (_|  __/\__/ /  __/ |   \ V /  __/ |
 \__,_|\___| \_/ |_|\___\___\____/ \___|_|    \_/ \___|_|

*/

var deviceServer = new devs(sockPort, db);

/*
     _            _          _____
    | |          (_)        /  ___|
  __| | _____   ___  ___ ___\ `--.  ___ _ ____   _____ _ __
 / _` |/ _ \ \ / / |/ __/ _ \`--. \/ _ \ '__\ \ / / _ \ '__|
| (_| |  __/\ V /| | (_|  __/\__/ /  __/ |   \ V /  __/ |
 \__,_|\___| \_/ |_|\___\___\____/ \___|_|    \_/ \___|_|

*/

console.log('done.');
