/**
* Amadeu Cavalcante
* Module for Roles
*/
var Waterline = require('waterline');

module.exports =  Waterline.Collection.extend({
  identity : 'class',
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
      school: {
        model: 'school',
        required: true
      },
			rooms: {
				collection: 'room',
				via: 'type'
			},
			active: {
				type: 'boolean',
				defaultsTo: true
			}
    }
  });
