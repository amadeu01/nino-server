var express = require('express');
var router = express.Router();
var app = require('../app');
var permissions = require('../permissions');

var validator = function(req, res, next, id) {
	if (!isNaN(id)) {
		next();
	} else {
		res.sendStatus(404);
	}
};

router.param('school_id', validator);
router.param('educator_id', validator);
router.param('classroom_id', validator);

/* Get users listing for a school. */
router.get('/schools/:school_id', function(req, res, next) {
	if (!req.token) {
		res.status(401); //User not logged in
		res.end();
		return;
	}
	app.models.educator.findOne({id: req.token.role.id})
	.then(function(educator) {
		if (educator.school != req.params.school_id)
		{
			res.status(401); //User is not member of that school, thus can't modify
			res.end();
			return;
		}
		return app.models.roles.findOne({id: educator.role});
	})
	.then(function(role) {
		if (!permissions.check(role.privileges, permissions.types.readAllSchoolEducators)) {
			res.status(401); //User doesn't have permissions
			res.end();
			return;
		}
		//All checked, should proceed
		res.end();
	})
	.catch(function(err) {
		res.status(500); //User not logged in
		res.end();
		return;
	});
});

/* Create new Caretaker for that school */
router.post('/schools/:school_id', function(req, res, next) {
	//TODO: check if exists before creating, can just be adding a role. Maybe another route?
	//Checking user credentials
	if (!req.token) {
		res.status(401);
		res.end();
		return;
	}
	// console.log(req.token);
	res.end();
	//Creating Educator
	
});


router.get('/classrooms/:classroom_id', function(req, res, next) {
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
