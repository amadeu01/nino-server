var express = require('express');
var router = express.Router();

/*Check if parameter is valid id*/
var validator = function(req, res, next, id) {
	if (!isNaN(id)) {
		next();
	} else {
		res.sendStatus(404);
	}
};

router.param('guardian_id', validator);
router.param('baby_id', validator);

/* Get list of Baby Guardians. */
router.get('/babies/:baby_id', function(req, res, next) {
  res.send('WIP');
});

/*Get Guardian info*/
router.get('/:guardian_id', function(req, res, next) {
  res.send('WIP');
});

/*Add a Guardian to a Baby */
router.post('/:guardian_id/babies/:baby_id', function(req, res, next) {
  res.send('WIP');
});

/*Create a new Guardian*/
router.post('/', function(req, res, next) {
	res.send('WIP');
});

/*Delete a Guardian*/
router.delete('/:guardian_id', function(req, res, next) {
	res.send('WIP');
});

/*Delete the 'Guardianship' between a Guardian and a Baby*/
router.delete('/:guardian_id/babies/:baby_id', function(req, res, next) {
	res.send('WIP');
});

/*Update a Guardian information*/
router.put('/:guardian_id', function(req, res, next) {
	res.send('WIP');
});

module.exports = router;