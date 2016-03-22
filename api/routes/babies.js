var express = require('express');
var router = express.Router();

var validator = function(req, res, next, id) {
	if (!isNaN(id)) {
		next();
	} else {
		res.sendStatus(404);
	}
};

router.param('guardian_id', validator);
router.param('baby_id', validator);

/* Get Babies listing for a Guardian. */
router.get('/guardians/:guardian_id', function(req, res, next) {
  res.send('WIP');
});

/* Get Baby info */
router.get('/:baby_id', function(req, res, next) {
  res.send('WIP');
});

/* Create a new baby */
router.post('/:baby_id', function(req, res, next) {
  res.send('WIP');
});

/* Deletes Baby */
router.delete('/:baby_id', function(req, res, next) {
  res.send('WIP');
});

/* Updates Baby */
router.put('/:baby_id', function(req, res, next) {
  res.send('WIP');
});

module.exports = router;