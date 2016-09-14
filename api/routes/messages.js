/** @module routes/accounts */

var express = require('express');
var router = express.Router();
var responses = require('../mechanisms/responses.js');
var messagesBO = require('../business/messages.js');
var app = express();

router.post('/', function(req, res, next) {
	console.log(req.headers);
	res.send("ok");
	return;
	return new Promise(function(resolve, reject) {
		var post = {
			message: req.body.subject + "\n\n" + req.body.stripped-text,
			type: 1
		};
		messagesBO.postMessage(post, req.body.sender, req.body.recipient)
	}).then(function(resp) {
		res.status(resp.code).json(resp.json);
	}).catch(function(err){
		var resp = responses.internalError(err);
		res.status(resp.code).json(resp.json);
	});
});

module.exports = router;