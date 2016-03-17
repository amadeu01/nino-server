/**
* Amadeu Cavalcante
* Module for Roles
*/
var Waterline = require('waterline')

module.exports =  Waterline.Collection.extend({
  identity : 'educator',
  connection: 'default',
		attributes: {
			id: {
				type: 'integer',
				primaryKey: true,
				autoIncrement: true
			},
      babies: {
        collection: 'student',
        index: true
      },
      role {model: 'role'}
    }
  });
