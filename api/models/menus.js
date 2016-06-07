/**
* Amadeu Cavalcante
* Module for Roles
*/
var Waterline = require('waterline');

module.exports =  Waterline.Collection.extend({
  identity : 'menu',
  connection: 'default',
		attributes: {
			id: {
				type: 'integer',
				primaryKey: true,
				autoIncrement: true
			},
			school: {
				model: 'school'
			},
			description: {
				type: 'string'
			},
			classes: {
				collection: 'class',
				via: 'menu'
			},
			active: {
				type: 'boolean',
				defaultsTo: true
			}
    }
  });
