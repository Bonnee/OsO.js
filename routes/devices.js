var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Device = require('../models/device.js');

/* GET devices listing. */
router.get('/', function(req, res, next) {
	Device.find(function(err, devices) {
		if (err) return err;
		res.json(devices);
	})
});

module.exports = router;
