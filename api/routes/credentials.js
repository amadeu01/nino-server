var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var app = require('../app');
var crypto = require('crypto');

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
	// console.log(req.useragent);
  if (req.body.password && req.body.email) { //Check if all parameters were received
		app.models.user.findOne({email: req.body.email, password: req.body.password}).populate('roles').exec(function(err, user) {
			if (err) { //Database error
				res.status(500);
				res.end(err);
				return;
			}
			if (!user) { //Login failed
				res.status(401);
				res.end('Fail');
				return;
			}
			for (var role in user.roles) { //Check is role exists
				if (user.roles[role].type == 'educator') {
					var token = jwt.sign({user: user, role: user.roles[role]}, app.get('jwtSecret'), {
	          expiresIn: 1440 // expires in 24 hours
	        });
					res.json({
	          success: true,
	          message: 'Success!',
	          token: token
	        });
					return;
				}
			}
		});
  } else {
		res.sendStatus(401);
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