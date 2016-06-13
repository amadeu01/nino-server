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
			account: {
				model: 'account'
			},
      device: {
        type: 'string',
        required: true,
				index: true
    	},
			notifiable: {
				type: 'boolean',
				defaultsTo: true
			}, 
			notificationID: {
				type: 'string'
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
