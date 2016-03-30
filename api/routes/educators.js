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
		res.status(401);
		res.end();
		return;
	}
	app.models.educator.findOne({id: req.token.role.id}).exec(function(err, educator) {
		if (educator.school != req.params.school_id)
		{
			res.status(401);
			res.end();
			return;
		}
		app.models.educator.find({school:req.params.school_id}).exec(function(err, educators) {
			if (err) {
				res.status(500);
				res.json(err);
				return;
			}
			var idquery = [];
			for (var each in educators)
			{
				idquery.push(educators[each].role);
			}
			app.models.role.find({id: idquery}).populate('owner').exec(function(err, users) {
				if (err) {
					res.status(500);
					res.json(err);
					return;
				}
				res.json(users);
			});
		});
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
