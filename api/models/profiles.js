/**
* Carlos Millani
* Model for Profiles
*/
var Waterline = require('waterline');

module.exports =  Waterline.Collection.extend({
  identity : 'profile',
  connection: 'default',
		attributes: {
			id: {
				type: 'integer',
				primaryKey: true,
				autoIncrement: true
			},
			name: {
				type: 'string',
				required: true
			},
			surname: {
				type: 'string',
				required: true
			},
			birthDate: {
				type: 'datetime',
				required: true
			},
			gender: {
				type: 'integer', //Define enum in Business
				required: true
			},
			guardianData: {
				model: 'guardian'
			},
			employeeData: {
				model: 'employee'
			},
			studentData: {
				model: 'student'
			},
			active: {
				type: 'boolean',
				defaultsTo: true
			},
			posts: {
				collection: 'post',
				via: 'profiles'
			}, 
			drafts: {
				collection: 'draft',
				via: 'profiles'
			},
    }
  });
