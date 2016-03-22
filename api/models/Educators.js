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
      school: {
        model: 'school',
        index: true
      },
      students: {
        collection: 'student',
        index: true
      },
      role: {
        model: 'role',
        required: true
      }
    }
  });
