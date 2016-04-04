var db = require('mongoose');

var deviceSchema = new db.Schema({
    _id: { type: String, lowercase: true },
    name: String,
    description: String,
    location: String,
    dateAdd: { type: Date, default: Date.now },
    settings: [{ name: String, value: String }]
});

var Device = mongoose.model('Device', deviceSchema);

this.addDevice = function() {
  
}
