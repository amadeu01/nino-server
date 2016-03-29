/**
* Amadeu Cavalcante
* Module services
*/
var models = require('../models');

var schoolServices = {
	create: function() {
		app.models.school.create({
			name: req.body.school.name,
			email: req.body.school.email,
			cnpj: req.body.school.cnpj,
			telephone: req.body.school.telephone,
			addr: req.body.school.addr,
			active: true
		}).exec(function(err, school) {
			if (err) {
				res.status(500);
				res.end();
				return;
			}
			app.models.user.create({
					name: req.body.owner.name, 
					surname: req.body.owner.surname, 
					password: req.body.owner.password, 
					email: req.body.owner.email,
					cel: req.body.owner.cel
			}).exec(function(err, user) {
				if (err) {
					res.status(500);
					res.end();
					return;
				}
				app.models.role.create({
					type: 'owner',
					privileges: 100, //TODO: set to all
					user: user.id
				}).exec(function(err, role) {
					if (err) {
						res.status(500);
						res.end();
						return;
					}
					app.models.educator.create({
						role: role.id,
						school: school.id
					}).exec(function(err, educator) {
						if (err) {
							res.status(500);
							res.end();
							return;
						}
						school.owner = educator.id;
						school.save(function(err) {
							if (err) {
								res.status(500);
								res.end();
								return;
							}
							res.json({school:school.id, educator: educator.id});
						});
					});
				});
			});
		});
	},
	delete: function() {

	},
	update: function() {

	},
	read: function() {

	}
};

module.exports = schoolServices;
