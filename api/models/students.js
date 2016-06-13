/**
* Carlos Millani
* Module for Students
*/
var Waterline = require('waterline');

module.exports =  Waterline.Collection.extend({
  identity : 'student',
  connection: 'default',
	attributes: {
		id: {
			type: 'integer',
			primaryKey: true,
			autoIncrement: true
		},
		profile: {
			model: 'profile',
			required: true
		},
		school: {
			model: 'school',
			required: true
		},
		room: {
			model: 'room'
		},
		guardians: {
			collection: 'guardian',
			via: 'students'
		}
	}
});
