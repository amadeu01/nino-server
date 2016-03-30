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
router.param('student_id', validator);

/* Get list of Student's Guardians. */
router.get('/guardians/:student_id', function(req, res, next) {
	if (!req.token) {
		res.status(401);
		res.end();
		return;
	}
	app.models.guardian.find({id: req.token.role.id}).populate('students').then(function(guardians) {
		var results = [];
		//guardian may have more than 1 student
		var thereIsStudent = true;
		for (var i = 0; i < guardians.length; i++) {
			thereIsStudent = true;
			var guardian = guardians[i];
			for (var k = 0; i < guardian.students.length; k++){
				var student = guardian.students[k];
				if (student === student_id) {
					results.push(guardian);
				}
			}
		}
		if (results.length === 0)
		{
			res.status(500);
			res.end();
			throw Error('No guardian found');
		} else {
			res.status(200)
			res.json(results);
		}
	}).catch(function(err){
		//Miss handle Error
		//res.status(500);
		//res.end();
	});
});

/*Get Guardian info*/
router.get('/:guardian_id', function(req, res, next) {

	app.models.guardian.findOne({ id: req.params.guardian_id }).populate('role').then(function(guardian) {
		return app.models.role.findOne({id: guardian.role.id}).populate('owner').then(function(user) {
			res.json(user);
			return;
		});

	}).catch(function(err) {
		res.status(500);
		res.end();
	});
});

/*Add a Guardian to a Student */
router.post('/:guardian_id/student/:student_id', function(req, res, next) {
	//TODO: check if exists before creating, can just be adding a role. Maybe another route?
	//Checking user credentials
	if (!req.token) {
		res.status(401);
		res.end();
		return;
	}
	// console.log(req.token);

	//Creating Educator
	app.models.user.create({
		name: req.body.user.name,
		surname: req.body.user.surname,
		password: req.body.user.password,
		email: req.body.user.email,
		cel: req.body.user.cel
	}).exec(function(err, user) {
		if (err) {
			res.json(err);
			return;
		}
		console.log(user);
		app.models.role.create({
				type: 'educator',
				privileges: req.body.privileges
		}).exec(function(err, role) {
			if (err) {
				res.json(err);
				return;
			}
			console.log(role);
			user.roles.add(role.id);
			user.save(function(err){
				if (err) {
					res.json(err);
					return;
				}
				app.models.educator.create({
					role: role.id,
					school: req.params.school_id
				}).exec(function(err, educator) {
					if (err) {
						res.json(err);
						return;
					}
					res.json(educator);
					// console.log(educator);
					// app.models.user.find().populate('roles').exec(function(err,user) {
					// 	console.log(user);
					// })
					// app.models.educator.find().populate('role').populate('school').exec(function(err,educator) {
					// 	console.log(educator);
					// })
				});
			});
		});
	});
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
