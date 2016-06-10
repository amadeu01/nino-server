/**
* Amadeu Cavalcante
* Module for Roles
*/
var Waterline = require('waterline');

module.exports =  Waterline.Collection.extend({
  identity : 'event',
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
			room: {
				model: 'room'
			},
			class: {
				model: 'class'
			},
			date: {
				type: 'datetime',
				required: true
			},
			description: {
				type: 'string'
			},
			confirmations: {
				type: 'array'
			},
			active: {
				type: 'boolean',
				defaultsTo: true
			}
    }
  });
