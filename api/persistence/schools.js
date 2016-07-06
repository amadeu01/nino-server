/** @module persistence */

//var models = require('../models');

//var errors = require('../services/errors');

var validator = require('validator');
//var permissions = require('../services/permissions');
var transaction = require('../mechanisms/transaction');
var pool = require('../mechanisms/database.js').pool;

/**
* @class
*/
var schoolServices = {
	/** 
	 * @method create
	 * @description Creates a new school with profile.id as owner
	 * @param school {School}
	 * @param profile {Profile}
	 * @return promise {Promise}
	 */
	create: function(school, profile) {
		//TODO: aqui eu vou criar a escola
		//TODO; preciso botar campo de active das coisas do DB :O
		return new Promise(function(resolve, reject) {
			pool.connect(function(err, client, done) {
				if (err) {
					reject(err);
					return;
				}
				transaction.start(client)
				.then(function() {
					return new Promise(function(res,rej) {
						client.query('INSERT INTO schools (owner, notificationGroup, address, cnpj, telephone, email, name) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',[profile.id, school.notificationGroup, school.address, school.cnpj, school.telephone, school.email, school.name], function(err, result) {
							if (err) rej(err); //Error, reject to BO
							else if (result.rowCount == 0) rej(result); //Reject here - will stop transaction
							else if (result.name == "error") rej(result); //Some error occured : rejects
							else res(result);	//Proceed to commit transaction
						});
					});
				}).then(function(result) {
					return transaction.commit(client)
					.then(function() {
						done();
						resolve({school:result.rows[0]}); //Resolves created to BO
					}).catch(function(err) {
						done(err);
						reject(err);
					});
				}).catch(function(err) {
					return transaction.abort(client)
					.then(function() {
						done();
						reject(err);
					}).catch( function(err2) {
						done(err2);
						reject(err2);
					});
				});
			});
		});	
	},
	/* Create a school with a standard class and room void. */
	createWithClassAndRoom: function(parameters) {
		if (!validator.isEmail(parameters.school.email)) throw errors.invalidParameters('Invalid School email');
		if (!validator.isEmail(parameters.owner.email)) throw errors.invalidParameters('Invalid User email');

		return models.waterline.collections.school.create({
			name: parameters.school.name,
			email: parameters.school.email,
			cnpj: parameters.school.cnpj,
			telephone: parameters.school.telephone,
			addr: parameters.school.addr,
			active: true
		})
		.then (function(school) {
			if (!school) throw errors.internalError('School - Creation Error');
			return models.waterline.collections.user.create({
					name: parameters.owner.name,
					surname: parameters.owner.surname,
					password: parameters.owner.password,
					email: parameters.owner.email,
					cel: parameters.owner.cel
			})
			.then(function(user) {
				if (!user) throw errors.internalError('User - Creation Error');
				return models.waterline.collections.role.create({
					type: 'educator',
					privileges: permissions.all(),
					owner: user.id
				})
				.then(function(role) {
					if (!role) throw errors.internalError('Role - Creation Error');
					return models.waterline.collections.educator.create({
						role: role.id,
						school: school.id
					})
					.then(function(educator) {//This is also owner.
						if (!educator) throw errors.internalError('Educator - Creation Error');
				 		school.owner = educator.id;
				 		school.save();
						return models.waterline.collections.class.create({
							name: parameters.class.name,
							school: school.id
						})
						.then(function(createdClass) {
					 		return models.waterline.collections.room.create({
					  		name: parameters.room.name,
								type: parameters.room.type
					  	})
							.then(function(room){
								educator.rooms.add(room.id);
								return educator.save().then(function(){
									return ({school: school.id, room: room.id, educator: educator.id, createdClass: createdClass.id});
								});
							});
						});
					});
				});
			});
		});
	},
	delete: function(parameters) {
		if (!parameters) throw errors.invalidParameters('Missing Parameter');
		return models.waterline.collections.school.findOne(parameters)
		.then(function(school) {
			if (!school) throw errors.inexistentRegister('School - Deletion Error');
			school.active = false;
			school.save();
			return models.waterline.collections.educator.find({school:school.id, active: true});
		})
		.then(function(educators) {
			if (!educators) errors.inexistentRegister('Educator - Finding Error');
			var eduList = educators.map(function(educator){return educator.id;});
			return models.waterline.collections.educator.update({id: eduList}, {active: false});
		})
		.then(function(deleted) {
			if (!deleted) throw errors.internalError('Educator - Deletion Error');
			var eduList = deleted.map(function(educator){return educator.id;});
			return models.waterline.collections.role.find({id: eduList});
		})
		.then(function(roles) {
			if (!roles) throw errors.inexistentRegister('Role - Deletion Error');
			var roleList = roles.map(function(role){return role.id;});
			return models.waterline.collections.role.update({id: roleList}, {active: false});
		});
	},
	update: function(parameters, newParatemers) {
		if (!parameters || !newParatemers) throw errors.invalidParameters('Missing Parameter');
		parameters.active = true;
		return models.waterline.collections.school.update(parameters, newParatemers);
	},
	read: function(parameters) {
		if (!parameters) throw errors.invalidParameters('Missing Parameter');
		parameters.active = true;
		return models.waterline.collections.school.findOne(parameters);
	},
	readComplete: function(parameters) {
		if (!parameters) throw errors.invalidParameters('Missing Parameter');
		parameters.active = true;
		return models.waterline.collections.school.findOne(parameters).populate(['educators', 'students', 'classes', 'owner']);
	},
	description: function(parameters) {
		if (!parameters) throw errors.invalidParameters('Missing Parameter');
		parameters.active = true;
		return models.waterline.collections.school.findOne(parameters).populate(['educators', 'students', 'classes', 'owner'])
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
				data += "\nClassroom: " + JSON.stringify(student.room);
				data += "\n ------Next";
			});
			data += "\n=================Classroom====================\n";
			school.classes.forEach(function(classroom){
				data += "\nName: " + classroom.name;
				data += "\nSchool: " + classroom.school;
				data += "\n ------Next";
			});
			return data;
		});
	}
};

module.exports = schoolServices;
