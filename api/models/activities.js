/**
* Amadeu Cavalcante
* Module for Roles
*/
var Waterline = require('waterline');

module.exports =  Waterline.Collection.extend({
  identity : 'activity',
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
			desctiption: {
				type: 'string'
			},
      school: {
        model: 'school',
        required: true
      },
			classes: {
				collection: 'class'
			}
			active: {
				type: 'boolean',
				defaultsTo: true
			}
    }
  });
