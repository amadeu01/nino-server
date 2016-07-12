var express = require('express');
var router = express.Router();
var errors = require('../mechanisms/error');
var validator = require('validator');
var response = require('../mechanisms/response.js');
var useragent = require('express-useragent');
var studentBO = require('../business/students.js');

var numberValidate = function(req, res, next, id) {
	if (!isNaN(id)) {
		next();
	} else {
		res.status(400).end(errors.invalidParameters("path_isNaN"));
	}
};


module.exports = router;
