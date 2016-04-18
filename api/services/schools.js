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
var Classrooms = models.waterline.collections.classroom;
var errors = require('../business/errors');

var validator = require('validator');
var permissions = require('../business/permissions');

var schoolServices = {
	create: function(parameters) {
		if (!validator.isEmail(parameters.school.email)) throw errors.invalidParameters('Invalid School email');
		if (!validator.isEmail(parameters.owner.email)) throw errors.invalidParameters('Invalid User email');

		return Schools.create({
			name: parameters.school.name,
			email: parameters.school.email,
			cnpj: parameters.school.cnpj,
			telephone: parameters.school.telephone,
			addr: parameters.school.addr,
			active: true
		})
		.then (function(school) {
			if (!school) throw errors.internalError('School - Creation Error');
			return Users.create({
					name: parameters.owner.name,
					surname: parameters.owner.surname,
					password: parameters.owner.password,
					email: parameters.owner.email,
					cel: parameters.owner.cel
			})
			.then(function(user) {
				if (!user) throw errors.internalError('User - Creation Error');
				return Roles.create({
					type: 'educator',
					privileges: permissions.all(),
					owner: user.id
				});
			})
			.then(function(role) {
				if (!role) throw errors.internalError('Role - Creation Error');
				return Educators.create({
					role: role.id,
					school: school.id
				});
			})
			.then(function(educator) {
				if (!educator) throw errors.internalError('Educator - Creation Error');
				school.owner = educator.id;
				return school.save()
				.then(function(){
					return ({school:school.id, educator: educator.id});
				});
			});
		});
	},
	/* Create a school with a standard classroom void. */
	createWithClassrom: function(parameters) {
		if (!validator.isEmail(parameters.school.email)) throw errors.invalidParameters('Invalid School email');
		if (!validator.isEmail(parameters.owner.email)) throw errors.invalidParameters('Invalid User email');

		return Schools.create({
			name: parameters.school.name,
			email: parameters.school.email,
			cnpj: parameters.school.cnpj,
			telephone: parameters.school.telephone,
			addr: parameters.school.addr,
			active: true
		})
		.then (function(school) {
			if (!school) throw errors.internalError('School - Creation Error');
			return Users.create({
					name: parameters.owner.name,
					surname: parameters.owner.surname,
					password: parameters.owner.password,
					email: parameters.owner.email,
					cel: parameters.owner.cel
			})
			.then(function(user) {
				if (!user) throw errors.internalError('User - Creation Error');
				return Roles.create({
					type: 'educator',
					privileges: permissions.all(),
					owner: user.id
				})
				.then(function(role) {
					if (!role) throw errors.internalError('Role - Creation Error');
					return Educators.create({
						role: role.id,
						school: school.id
					})
					.then(function(educator) {//This is also owner.
						if (!educator) throw errors.internalError('Educator - Creation Error');
				 		school.owner = educator.id;
				 		school.save();
				 		return Classrooms.create({
				  		name: parameters.classroom.name,
					  	school: school.id
				  	})
						.then(function(classroom){
							educator.classrooms.add(classroom.id);
							return educator.save().then(function(){
								return ({school: school.id, classroom: classroom.id, educator: educator.id});
							});
						});
					});
				});
			});
		});
	},
	delete: function(parameters) {
		if (!parameters) throw errors.invalidParameters('Missing Parameter');
		return Schools.findOne(parameters)
		.then(function(school) {
			if (!school) throw errors.inexistentRegister('School - Deletion Error');
			school.active = false;
			school.save();
			return Educators.find({school:school.id, active: true});
		})
		.then(function(educators) {
			if (!educators) errors.inexistentRegister('Educator - Finding Error');
			var eduList = educators.map(function(educator){return educator.id;});
			return Educators.update({id: eduList}, {active: false});
		})
		.then(function(deleted) {
			if (!deleted) throw errors.internalError('Educator - Deletion Error');
			var eduList = deleted.map(function(educator){return educator.id;});
			return Roles.find({id: eduList});
		})
		.then(function(roles) {
			if (!roles) throw errors.inexistentRegister('Role - Deletion Error');
			var roleList = roles.map(function(role){return role.id;});
			return Roles.update({id: roleList}, {active: false});
		});
	},
	update: function(parameters, newParatemers) {
		if (!parameters || !newParatemers) throw errors.invalidParameters('Missing Parameter');
		parameters.active = true;
		return Schools.update(parameters, newParatemers);
	},
	read: function(parameters) {
		if (!parameters) throw errors.invalidParameters('Missing Parameter');
		parameters.active = true;
		return Schools.findOne(parameters);
	},
	readComplete: function(parameters) {
		if (!parameters) throw errors.invalidParameters('Missing Parameter');
		parameters.active = true;
		return Schools.findOne(parameters).populate(['educators', 'students', 'classrooms', 'owner']);
	},
	description: function(parameters) {
		if (!parameters) throw errors.invalidParameters('Missing Parameter');
		parameters.active = true;
		return Schools.findOne(parameters).populate(['educators', 'students', 'classrooms', 'owner'])
		.then(function(school){
			var data = "Name: " + JSON.stringify(school.name);
			data += "\nemail: " + JSON.stringify(school.email);
			data += "\nCNPJ: " + JSON.stringify(school.cnpj);
			data += "\nOwner: " + JSON.stringify(school.owner.id);
			data += "\nOwner: " + JSON.stringify(school.owner);
			data += "\n=================Educator====================\n";
			school.educators.forEach(function(educator){
				data += "\nEducator: " + educator.id;
				data += "\nRole: " + JSON.stringify(educator.role);
				data += "\nSchool: " + educator.school;
				data += "\n ------Next";
			});
			data += "\n=================Students====================\n";
			school.students.forEach(function(student){
				data += "\nStudent: " + student.id;
				data += "\nName: " + student.name;
				data += "\nSurname: " + student.surname;
				data += "\nBirthdate: " + student.birthdate;
				data += "\nSchool: " + JSON.stringify(student.school);
				data += "\nClassroom: " + JSON.stringify(student.classroom);
				data += "\n ------Next";
			});
			data += "\n=================Classroom====================\n";
			school.classrooms.forEach(function(classroom){
				data += "\nName: " + classroom.name;
				data += "\nSchool: " + classroom.school;
				data += "\n ------Next";
			});
			return data;
		});
	}
};

module.exports = schoolServices;
