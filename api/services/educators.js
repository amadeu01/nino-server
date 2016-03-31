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

var validator = require('validator');

var educatorServices = {
	create: function(parameters) {
		if (!validator.isEmail(parameters.user.email)) throw 'Invalid School Mail'; //TODO Replace with real error

		return Users.create({
				name: parameters.user.name,
				surname: parameters.user.surname,
				password: parameters.user.password,
				email: parameters.user.email,
				cel: parameters.user.cel
		})
		.then(function(user) {
			return Roles.create({
				type: 'educator',
				privileges: parameters.privileges, //TODO: set to all
				owner: user.id
			});
		})
		.then(function(role) {
			return Educators.create({
				role: role.id,
				school: parameters.schoolID
			});
		})
		.then(function(educator) {
			return ({educator: educator.id});
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
		return Educators.findOne(parameters)
		.then(function (educator) {
			return Roles.findOne({id: educator.role}).populate('owner');
		});
	},
	readAllFromSchool: function(parameters) {
		return Educators.find({school:parameters.schoolID})
		.then(function(educators) {
			educators.map(function(educator) {
				return educator.role;
			});
			return Roles.find({id: educators}).populate('owner');
		});
	}
};

module.exports = educatorServices;
