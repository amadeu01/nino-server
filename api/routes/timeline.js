var express = require('express');
var router = express.Router();

var validator = function(req, res, next, id) {
	if (!isNaN(id)) {
		next();
	} else {
		res.sendStatus(404);
	}
};

router.param('baby_id', validator);
router.param('guardian_id', validator);
router.param('post_id', validator);

/* Get Timeline cells for that Baby. */
router.get('/babies/:baby_id', function(req, res, next) {
  res.send('WIP');
});

/* Get Timeline cells for that Guardian */
router.get('/guardians/:guardian_id', function(req, res, next) {
  res.send('WIP');
});

/* Create new Post for a Baby */
router.post('/babies/:baby_id', function(req, res, next) {
  res.send('WIP');
});

/* Delete Post */
router.delete('/:post_id', function(req, res, next) {
  res.send('WIP');
});

/* Update Post */
router.put('/:post_id', function(req, res, next) {
  res.send('WIP');
});

module.exports = router;