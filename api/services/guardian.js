var models = require('../models');
var services = require ('.');
var Guardians = models.waterline.collections.guardian;
var Role = models.waterline.collections.role;
var guardiansServices = {
	create: function(params, done) {
		var errors = {};
		var results = {};
		console.log("create");
		//First of all, create a role
		Role.create({
			privileges: '1',
			role_type: 'guardian',
			user: 2
		}).then(function(role){
			console.log("entrou");
			console.log(role);
		});
		// Role.create({
		// 	privileges: '1',
		// 	role_type: 'guardian',
		// 	user: '2'
		// }, function(err, role){
		// 	console.log("entrou");
		// 	if (err){
		// 		console.log(err);
		// 	}
		// 	results.role = role;
		// 	//console.log(Guardians);
		// 	Guardians.create( { role: role.id }, function(err, guardian) {
		// 		console.log("entrou");
		// 		console.log(err);
		// 		if (err) { //Error ocurred, stops and cleans DB (TODO) in order to keep sanity
		// 			errors.guardian = err;
		// 			done(errors, results);
		// 			return;
		// 		}
		// 	});
		// });
	},
	delete: function() {

	},
	read: function() {

	},
	update: function() {

	}
};

module.exports = guardiansServices;
