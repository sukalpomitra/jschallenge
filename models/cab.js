
// Dependencies
var restful = require('node-restful');
var mongoose = restful.mongoose;

// Schema
var cabSchema = new mongoose.Schema({
    name: String,
    phone: Number,
    bookingDate: String,
	cancelled: Number
});


// Return model
module.exports = restful.model('Cabs', cabSchema);