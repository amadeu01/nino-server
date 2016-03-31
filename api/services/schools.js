/**
* Carlos Millani
* Module services
*/

var models = require('../models');
var Users = models.waterline.collections.user;
var Educators = models.waterline.collections.educator;
var Roles = models.waterline.collections.role;
var Devices = models.waterline.collections.device;
var Credentials = models.waterline.collections.credential;
var Schools = models.waterline.collections.school;

var validator = require('validator');

var permissions = require('../permissions');

var schoolServices = {
	create: function(parameters) {
		if (!validator.isEmail(parameters.school.email)) throw 'Invalid School Mail'; //TODO Replace with real error
		if (!validator.isEmail(parameters.owner.email)) throw 'Invalid Owner Mail';

		return Schools.create({
			name: parameters.school.name,
			email: parameters.school.email,
			cnpj: parameters.school.cnpj,
			telephone: parameters.school.telephone,
			addr: parameters.school.addr,
			active: true
		})
		.then (function(school) {
			// gSchool = school;
			return Users.create({
					name: parameters.owner.name,
					surname: parameters.owner.surname,
					password: parameters.owner.password,
					email: parameters.owner.email,
					cel: parameters.owner.cel
			})
			.then(function(user) {
				// gUser = user;
				return Roles.create({
					type: 'educator',
					privileges: permissions.all(), //TODO: set to all
					user: user.id
				});
			})
			.then(function(role) {
				// gRole = role;
				return Educators.create({
					role: role.id,
					school: school.id
				});
			})
			.then(function(educator) {
				// gEducator = educator;
				school.owner = educator.id;
				return school.save()
				.then(function(){
					return ({school:school.id, educator: educator.id});
				});
			});
		})
		.catch(function(error) {
			throw error;
		});
	},
	delete: function() {

	},
	update: function() {

	},
	read: function(parameters) {
		return Schools.findOne(parameters);
	}
};

module.exports = schoolServices;
