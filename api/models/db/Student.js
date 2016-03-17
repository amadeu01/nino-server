/**
* Amadeu Cavalcante
* Module for Roles
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
      name: {
				type: 'string',
				size: 40,
				required: true
			},
			surname: {
				type: 'string',
				size: 40,
				required: true
			},
      birthdate: {
        type: 'string',
        size: 20,
        required: true
      },
      gender: {
        enum: ['male', 'female', 'none'],
        defaultsTo: 'none'
      },
      guardians: {
        collection: 'guardian',
        index: true
      },
      shool: {
        model: 'school',
        index: true
      }
    }
  });
