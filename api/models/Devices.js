/**
* Amadeu Cavalcante
* Module for Roles
*/
var Waterline = require('waterline');

module.exports =  Waterline.Collection.extend({
  identity : 'device',
  connection: 'default',
		attributes: {
			id: {
				type: 'integer',
				primaryKey: true,
				autoIncrement: true
			},
      arn: {
        type: 'string',
        size: 60,
        required: true
      },
      description: {
        type: 'string',
        size: 120
      },
			active: {
				type: 'boolean',
				defaultsTo: true
			},
      owner: {
        model: 'user',
        index: true,
        required: true
      }
    }
  });
