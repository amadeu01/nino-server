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
router.param('educator_id', validator);

/* Get users listing. */
router.get('/schools/:school_id', function(req, res, next) {
  res.send('WIP');
});

/* Create new Caretaker for that school */
router.post('/schools/:school_id', function(req, res, next) {
  res.send('WIP');
});

/* Delete a caretaker */
router.delete('/:educator_id', function(req, res, next) {
  res.send('WIP');
});

/* Update a caretaker */
router.put('/:educator_id', function(req, res, next) {
  res.send('WIP');
});

module.exports = router;