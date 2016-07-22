var express = require('express');
var router = express.Router();
var responses = require('../mechanisms/responses.js');

var numberValidate = function(req, res, next, id) {
	if (!isNaN(id)) {
		next();
	} else {
		res.status(400).end(responses.invalidParameters("path_isNaN"));
	}
};


module.exports = router;