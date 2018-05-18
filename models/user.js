var mongoose = require('mongoose');
var passportLocalMongoose = require("passport-local-mongoose");

// User Schema
var UserSchema = mongoose.Schema({
	username: {
		type: String,
		index:true
	},
	password: {
		type: String
	},
	email: {
		type: String, unique:true
	},
	name: {
		type: String
	},
	socialuser_id : {
		type: String
	},

	provider:{
		type: String
	},
	resetPasswordToken:{
		type: String
	},
	resetPasswordExpires: {
				type: Date
	},
	token:{
		type: String
	},
	role: {
		type: String
		},
	status :{
		type : Boolean
	}, 
	createdby : {
		type : String
	}
});
UserSchema.plugin(passportLocalMongoose)

var User = module.exports = mongoose.model('User', UserSchema);