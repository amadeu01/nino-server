/**
* @author Amadeu Cavalcante
* @description Model for drafts
*/
var Waterline = require('waterline');

module.exports =  Waterline.Collection.extend({
  identity : 'draft',
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
				via: 'drafts',
        index: true
      },
			class: {
				model: 'class'
			},
			room: {
				model: 'room'
			},
      type: {
        type: 'string',
        enum: ['photo', 'schedule', 'announcement', 'custom']
      },
			active: {
				type: 'boolean',
				defaultsTo: true
			}
    }
  });
