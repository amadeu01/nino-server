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
        type: 'date',
        required: true
      },
      //reference to picture on s3
      profile_picture: {
        type: 'string'
      },
      gender: {
        type: 'string',
        size: 10,
        enum: ['male', 'female', 'none'],
        defaultsTo: 'none'
      },
      posts: {
        collection: 'post',
        via: 'students'
      },
      guardians: {
        collection: 'guardian',
				via: 'students',
        index: true
      },
      room: {
        model: 'room',
        via: 'students'
      },
      school: {
        model: 'school',
        index: true,
        required: true
      },
			active: {
				type: 'boolean',
				defaultsTo: true
			}
    }
  });
