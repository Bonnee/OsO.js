var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Device = require('../models/device.js');

/* GET devices listing. */
router.get('/', function(req, res, next) {
	Device.find(function(err, devs) {
		if (err) return err;
		//res.json(devs);
		var result = [];
		for (var i = 0; i < devs.length; i++)
			result.push({
				id: devs[i]._id,
				name: devs[i].name,
				description: devs[i].description,
				location: devs[i].location
			});
		res.send(result);
	});
});

router.get('/:id', function(req, res, next) {
	Device.findById(req.params.id, function(err, post) {
		if (err) return next(err);
		res.json(post);
	});
});

module.exports = router;
