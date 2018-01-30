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
			rooms: {
				collection: 'room',
				via: 'class'
			},
      school: {
        model: 'school',
        required: true
      },
			menu: {
				model: 'menu'
			},
			activities: {
				collection: 'activity',
				via: 'classes'
			},
			active: {
				type: 'boolean',
				defaultsTo: true
			}
    }
  });
