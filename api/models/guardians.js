/**
* Carlos Millani
* Module for Guardians
*/
var Waterline = require('waterline');

module.exports =  Waterline.Collection.extend({
  identity : 'guardian',
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
		students: {
			collection: 'student',
			via: 'guardians'
		}
	}
});
