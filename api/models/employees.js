/**
* Carlos Millani
* Module for Employees
*/
var Waterline = require('waterline');

module.exports =  Waterline.Collection.extend({
  identity : 'employee',
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
		rooms: {
			collection: 'room',
			via: 'employees'
		}
	}
});
