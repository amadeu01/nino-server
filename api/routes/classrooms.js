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
router.param('classroom_id', validator);
router.param('educator_id', validator);
router.param('student_id', validator);

/* Get all classrooms for a school */
router.get('/schools/:school_id', function(req, res, next) {
  res.send('WIP');
});

/* Create a new classroom for a school */
router.post('/schools/:school_id', function(req, res, next) {
  res.send('WIP');
});

/* Update classroom information */
router.put('/:classroom_id', function(req, res, next) {
  res.send('WIP');
});

/* Marks a classroom for deletion */
router.delete('/:classroom_id', function(req, res, next) {
  res.send('WIP');
});

/* Add an educator to a classroom */
router.post('/:classroom_id/educators/:educator_id', function(req, res, next) {
  res.send('WIP');
});

/* Remove an educator from a classroom */
router.delete('/:classroom_id/educators/:educator_id', function(req, res, next) {
  res.send('WIP');
});

/* Add a student to a classroom */
router.post('/:classroom_id/students/:student_id', function(req, res, next) {
  res.send('WIP');
});

/* Remove a student from a classroom */
router.delete('/:classroom_id/students/:student_id', function(req, res, next) {
  res.send('WIP');
});

/* Get all classrooms for an educator */
router.get('/educators/:educator_id', function(req, res, next) {
  res.send('WIP');
});

module.exports = router;