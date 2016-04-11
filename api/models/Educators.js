/**
* Amadeu Cavalcante
* Module for Roles
*/
var Waterline = require('waterline');

module.exports =  Waterline.Collection.extend({
  identity : 'educator',
  connection: 'default',
		attributes: {
			id: {
				type: 'integer',
				primaryKey: true,
				autoIncrement: true
			},
      classrooms: {
        collection: 'classroom',
				via: 'educators',
        index: true
      },
      role: {
        model: 'role',
        required: true
      },
			school: {
				model: 'school',
				required: true
			},
			active: {
				type: 'boolean',
				defaultsTo: true
			}
    }
  });
