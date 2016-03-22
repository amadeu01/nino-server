var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var app = require('../app');

var validator = function(req, res, next, id) {
	if (!isNaN(id)) {
		next();
	} else {
		res.sendStatus(404);
	}
};

router.param('credential_id', validator);

/* Create a Caretaker credential : LogIn. */
router.post('/educators', function(req, res, next) {
  if (req.body.password && req.body.user) {
  	res.json("oKdoK");
  } else {
  	res.json("Nopes");
  }
});

/* Create a Guardian credential : LogIn. */
router.post('/guardians', function(req, res, next) {
  res.send('WIP');
});

/*LogOut*/
router.delete('/:credential_id', function(req, res, next) {
  res.send('WIP');
});

module.exports = router;