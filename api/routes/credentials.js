var express = require('express');
var router = express.Router();

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
  res.send('WIP');
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