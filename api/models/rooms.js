/**
* Amadeu Cavalcante
* Module for Roles
*/
var Waterline = require('waterline');

module.exports =  Waterline.Collection.extend({
  identity : 'room',
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
			class: {
				model: 'class'
			},
      students: {
        collection: 'student',
				via: 'room',
        index: true
      },
      employees: {
        collection: 'employee',
				via: 'rooms'
      },
			notificationGroup: {
				type: 'integer'
			},
			active: {
				type: 'boolean',
				defaultsTo: true
			}
    }
  });
