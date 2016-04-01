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
			if (!school) throw 'Error'
			return Users.create({
					name: parameters.owner.name,
					surname: parameters.owner.surname,
					password: parameters.owner.password,
					email: parameters.owner.email,
					cel: parameters.owner.cel
			})
			.then(function(user) {
				if (!user) throw 'Error'
				return Roles.create({
					type: 'educator',
					privileges: permissions.all(), //TODO: set to all
					user: user.id
				});
			})
			.then(function(role) {
				if (!role) throw 'Error'
				return Educators.create({
					role: role.id,
					school: school.id
				});
			})
			.then(function(educator) {
				if (!educator) throw 'Error'
				school.owner = educator.id;
				return school.save()
				.then(function(){
					return ({school:school.id, educator: educator.id});
				});
			});
		});
	},
	delete: function(parameters) {
		return Schools.findOne(parameters)
		.then(function(school) {
			if (!school) throw 'Error'
			school.active = false;
			school.save();
			return Educators.find({school:school.id, active: true})
		})
		.then(function(educators) {
			if (!educators) throw 'Error'
			var eduList = educators.map(function(educator){return educator.id});
			return Educators.update({id: eduList}, {active: false});
		})
		.then(function(deleted) {
			if (!deleted) throw 'Error'
			var eduList = deleted.map(function(educator){return educator.id});
			return Roles.find({id: eduList});
		})
		.then(function(roles) {
			if (!roles) throw 'Error'
			var roleList = roles.map(function(role){return role.id});
			return Roles.update({id: roleList}, {active: false});
		});
	},
	update: function(parameters, newParatemers) {
		if (!parameters || !newParatemers) throw 'Error'
		parameters.active = true;
		return Schools.update(parameters, newParatemers);
	},
	read: function(parameters) {
		if (!parameters) return undefined
		parameters.active = true;
		return Schools.findOne(parameters);
	}
};

module.exports = schoolServices;
