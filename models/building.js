var mongoose = require('mongoose');

// Credential Schema
var BuildingSchema = mongoose.Schema({
	name: {
		type: String
	},
	address: {
		type: String
	},
	owner_id: {
		type :String
	},
	floors: {
		type :Number
	}
});

var User = module.exports = mongoose.model('building', BuildingSchema);