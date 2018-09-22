var mongoose = require('mongoose');

// User Schema
var UserSchema = mongoose.Schema({
	username: {
		type: String,
		trim: true,
		index:true,
		unique: true
	},
	password: {
		type: String,
		trim: true
	},
	email: {
		type: String,
		unique: true
	},
	name: {
		type: String
	}
});

// This creates our model from the above schema, using mongoose's model method
var User = mongoose.model('User', UserSchema);

// Export the User model
module.exports = User;