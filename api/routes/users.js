var express = require('express');
var router = express.Router();

var validator = function(req, res, next, id) {
	if (!isNaN(id)) {
		next();
	} else {
		res.sendStatus(404);
	}
};

router.param('user_id', validator);

/* Update user's profile picture */
router.put('/:user_id/profilePic', function(req, res, next) {
  res.send('WIP');
});

/* Reads user's profile picture */
router.get('/:user_id/profilePic', function(req, res, next) {
  res.send('WIP');
});

/* Confirms user's register information */
router.post('/confirmation/:confirmation_hash', function(req, res, next) {
  res.send('WIP');
});

/* Post a notification to all devices of the user */
router.post('/:user_id/notifications', function(req, res, next) {
  res.send('WIP');
});


module.exports = router;