/** @module business/messages */

var validator = require('validator');
var responses = require('../mechanisms/responses.js');
var postsDAO = require('../persistence/posts.js');
var credentialDAO = require('../persistence/credentials.js');
var schoolsDAO = require('../persistence/schools.js');
var roomsDAO = require('../persistence/schools')
var studentsDAO = require('../persistence/students.js');
var messages = {};

messages.postMessage = function(post, author, target) {
	return new Promise(function(resolve, reject) {
		schoolsDAO.findWithEmail(author)
		.then(function(school) {
			roomsDAO.findWithSchoolAndName(school.id, target.split("@")[0].split(".")[0])
			.then(function(rooms) {
				if (rooms.length > 1) {
					resolve(responses.invalidParameters("multiple_rooms_found"));
				} else {
					var selected_room = rooms[0]
					studentsDAO.findWithRoomId(room.id)
					.then(function(students) {
						var target = []
						for (var i in students) {
							target.push(students[i].id)
						}
						postsDAO.createWithProfiles(post,school.owner, target)
						.then(function(resp) {
							resolve(responses.success());
						}).catch(function(err) {
							resolve(responses.persistenceError(err));
						});
					}).catch(function(err) {
						resolve(responses.persistenceError(err));
					})
				}
			}).catch(function(err) {
				resolve(responses.inexistentRegister("room_not_found"));
			})
		}).catch(function(err) {
			resolve(responses.inexistentRegister("school_not_found"));
		})
	});
}

module.exports = messages;
