var mongoose = require('mongoose');

var DeviceSchema = new mongoose.Schema({
	_id: {
		type: String,
		lowercase: true
	},
	name: String,
	description: String,
	location: String,
	dateAdd: {
		type: Date,
		default: Date.now
	},
	connected: Boolean,
	settings: [mongoose.Schema.Types.Mixed]
}, {
	strict: false
});

DeviceSchema.statics.exists = function(mac, back) {
	mac = mac.toLowerCase();

	this.find({
		_id: mac
	}, function(e, doc) {
		if (doc.length > 0)
			back(true, doc[0]);
		else
			back(false, doc);
	});
}

module.exports = mongoose.model('Device', DeviceSchema);
