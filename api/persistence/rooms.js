/** @module persistence */


var models = require('../models');

//errors and validator's module
var errors = require('../mechanisms/error');
var validator = require('validator');

var transaction = require('../mechanisms/transaction');
var pool = require('../mechanisms/database.js').pool;

/**
* @class
*/
var roomServices = {
	create: function(room, _class) {
		return new Promise(function (resolve, reject) {
			pool.connect(function(err, client, done) {
				if (err) {
					reject(err); //Error, reject to BO
					return;
				}
				transaction.start(client)
				.then(function() {
					return new Promise(function(res,rej) {
						client.query('INSERT INTO rooms (name, class, notificationGroup) VALUES ($1, $2, $3) RETURNING id',[room.name, _class.id, room.notificationGroup], function(err, result) {
							if (err) rej(err); //Error, reject to BO
							else if (result.rowCount == 0) rej(result); //Nothing inserted, rejects so BO can handle
							else if (result.name == "error") rej(result); //Some error occured : rejects
							else res(result);	//Proceed to commit transaction
						});
					});
				}).then(function(result) {
					return transaction.commit(client)
					.then(function() {
						done();
						resolve({room:result.rows[0]}); //Returns to BO
					}).catch(function(err) {
						done(err);
						reject(err); //Rejects to BO
					});
				}).catch(function(err) {
					return transaction.abort(client)
					.then(function() {
						done();
						reject(err); //Rejects the error
					}).catch( function(err2) {
						done(err2);
						reject(err2); //Rejects other error
					});
				});
			});
		});
	},
	delete: function(parameters) {
    if (!parameters) throw errors.invalidParameters('Missing Parameter');
    return models.waterline.collections.room.findOne(parameters)
    .then(function(room) {
      if (!room) throw errors.inexistentRegister('Classroom - Finding Error');
      room.active = false;
      return room.save();
    });
	},
	update: function(parameters, newParameters) {
    if (!parameters || !newParameters ) throw errors.invalidParameters('Missing Parameter');
    parameters.active = true;
    return models.waterline.collections.room.update(parameters, newParameters)
    .then(function(room) {
      if (!room) throw errors.inexistentRegister('Classroom - Finding Error');
      return;
    });
	},
  read: function(parameters) {
    if (!parameters) throw errors.invalidParameters('Missing Parameter');
    parameters.active = true;
    return models.waterline.collections.room.findOne(parameters)
    .then(function(room) {
      if (!room) return undefined;
      return;
    });
  },
  readAllStudents: function(parameters) {//id room
		if (!parameters) throw errors.invalidParameters('Missing Parameter');
		parameters.active = true;
		return models.waterline.collections.room.findOne(parameters).populate('students')
		.then (function (room) {
			if (!room) return undefined;
			if (!room.students) return undefined;
			//console.log(room);
			return room.students;
		});
	},
  readAllEducators: function(parameters) {
		if (!parameters) throw errors.invalidParameters('Missing Parameter');
		parameters.active = true;
		return models.waterline.collections.room.findOne(parameters).populate('educators')
		.then (function (room) {
			if (!room) return undefined;
			if (!room.educators) return undefined;
			return room.educators;
		});
  },
	readComplete: function(parameters) {
		if (!parameters) throw errors.invalidParameters('Missing Parameter');
		return models.waterline.collections.room.findOne(parameters).populate(['educators', 'students', 'type'])
		.then(function(room){
			if (!room) return undefined;
			return room;
		});
	},
	addStudent: function(parameters, student_id) {
		if (!parameters) throw errors.invalidParameters('Missing Parameter');
		return models.waterline.collections.room.findOne(parameters).populate('students')
		.then(function(room){
			if (!room) throw errors.inexistentRegister('Classroom - Finding Error');
			room.students.add(student_id);
			return room.save();
		});
	},
	addEducator: function(parameters, educator_id) {
		if (!parameters) throw errors.invalidParameters('Missing Parameter');
		parameters.active = true;
		return models.waterline.collections.room.findOne(parameters).populate('educators')
		.then(function(room){
			if (!room) throw errors.inexistentRegister('Classroom - Finding Error');
			room.educators.add(educator_id);
			return room.save();
		});
	}
};

module.exports = roomServices;
