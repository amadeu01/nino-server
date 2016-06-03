/**
* Amadeu Cavalcante
* Module for Roles
*/
var Waterline = require('waterline');

module.exports =  Waterline.Collection.extend({
  identity : 'credential',
  connection: 'default',
		attributes: {
			id: {
				type: 'integer',
				primaryKey: true,
				autoIncrement: true
			},
      device: {
        model: 'device',
        required: true,
				index: true
    	},
			token: {
				type: 'string',
				required: true
			},
			active: {
				type: 'boolean',
				defaultsTo: true
			}
    }
  });
