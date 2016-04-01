/**
* Amadeu Cavalcante
* Module for Roles
*/
var Waterline = require('waterline');

module.exports =  Waterline.Collection.extend({
  identity : 'classroom',
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
      students: {
        collection: 'student',
        index: true
      },
      educator: {
        collection: 'educator',
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
