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
router.param('student_id', validator);
router.param('classroom_id', validator);

/* Send push notification to all student's guardians */
router.put('/:student_id/notifications', function(req, res, next) {
  res.send('WIP');
});

/* Get Student info */
router.get('/:student_id', function(req, res, next) {
  res.send('WIP');
});

/* Deletes Student */
router.delete('/:student_id', function(req, res, next) {
  res.send('WIP');
});

/* Updates Student */
router.put('/:student_id', function(req, res, next) {
  res.send('WIP');
});

/* Updates Student's profile picture */
router.put('/:student_id/profilePic', function(req, res, next) {
  res.send('WIP');
});

/* Create a new Student for that school */
router.post('/schools/:school_id', function(req, res, next) {
  res.send('WIP');
});

/* Get students listing for a Guardian. */
router.get('/guardians/:guardian_id', function(req, res, next) {
  res.send('WIP');
});

/* Get list of students for a classroom */
router.get('/classrooms/:classroom_id', function(req, res, next) {
  res.send('WIP');
});

module.exports = router;
