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
router.param('device_id', validator);

/* Get guardians' list of devices. */
router.get('/users/:user_id', function(req, res, next) {
  res.send('WIP');
});

/* Get device's information */
router.get('/:device_id', function(req, res, next) {
  res.send('WIP');
});

/* Create new device */
router.post('/', function(req, res, next) {
  res.send('WIP');
});


/* Mark a device as inactive */
router.delete('/:device_id', function(req, res, next) {
  res.send('WIP');
});

module.exports = router;