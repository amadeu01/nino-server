/**
* Amadeu Cavalcante
* Module for Roles
*/
var Waterline = require('waterline');

module.exports =  Waterline.Collection.extend({
  identity : 'role',
  connection: 'default',
		attributes: {
			id: {
				type: 'integer',
				primaryKey: true,
				autoIncrement: true
			},
			type: {
				type: 'string',
				size: 15,
				enum: ['educator', 'guardian'],
				required: true
			},
			privileges: {
				type: 'integer',
				required: true
			},
      owner: {
        model: 'user'
      }
		}
	});
