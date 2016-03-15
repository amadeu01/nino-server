var express = require('express');
var router = express.Router();

var validator = function(req, res, next, id) {
	if (!isNaN(id)) {
		next();
	} else {
		res.sendStatus(404);
	}
};

router.param('school_id', validator);

/* Get School's info. */
router.get('/:school_id', function(req, res, next) {
  res.send('WIP');
});

/* Create new school */
router.post('/', function(req, res, next) {
  res.send('WIP');
});

/* Delete a School */
router.delete('/:school_id', function(req, res, next) {
  res.send('WIP');
});

/* Update a School */
router.put('/:school_id', function(req, res, next) {
  res.send('WIP');
});

module.exports = router;