var express = require('express');
var router = express.Router();

var validator = function(req, res, next, id) {
	if (!isNaN(id)) {
		next();
	} else {
		res.sendStatus(404);
	}
};

router.param('subscription_id', validator);

/* Greate new Subscription. */
router.post('/', function(req, res, next) {
  res.send('WIP');
});

/* Publicate to all subscribers and copy self */
router.post('/publications', function(req, res, next) {
  res.send('WIP');
});

/* Remove subscription */
router.delete('/:subscription_email', function(req, res, next) {
  res.send('WIP');
});

module.exports = router;