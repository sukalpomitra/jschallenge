
// Dependencies
var express = require('express');
var router = express.Router();
var app = express();

//Cab
var Cab = require('../models/cab');
Cab.methods(['get', 'put', 'post', 'delete']);
Cab.register(router, '/cabs');

// Return router
module.exports = router;
