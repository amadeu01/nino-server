/**
* Amadeu Cavalcante
* Model for posts
*/
var Waterline = require('waterline');

module.exports =  Waterline.Collection.extend({
  identity : 'post',
  connection: 'default',
		attributes: {
			id: {
				type: 'integer',
				primaryKey: true,
				autoIncrement: true
			},
      message: {
        type: 'string',
        required: true
      },
      attachment: { //reference to s3
        type: 'string',
        required: false
      },
      school: {
        model: 'school',
        index: true
      },
      profiles: {
        collection: 'profile',
				via: 'posts',
        index: true
      },
			class: {
				model: 'class'
			},
			room: {
				model: 'room'
			},
      date: {
        type: 'datetime',
        required: true,
        index: true
      },
      type: {
        type: 'string',
        enum: ['photo', 'schedule', 'announcement', 'custom']
      },
      educators: {
        collection: 'profile',
        index: true,
        required: true
      },
			read: {
				type: 'string'
			},
			active: {
				type: 'boolean',
				defaultsTo: true
			}
    }
  });
