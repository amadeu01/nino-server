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
        size: 60
      },
      description: {
        type: 'string',
				unique: true,
        size: 120,
				index: true,
				required: true
      },
			active: {
				type: 'boolean',
				defaultsTo: true
			},
      owner: {
        model: 'user',
        index: true,
        required: true
      },
			credentials: {
				collection: 'credential',
				via: 'device'
			}
    }
  });
