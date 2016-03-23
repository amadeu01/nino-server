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
			role_type: {
				type: 'string',
				size: 15,
				enum: ['educator', 'guardian', 'owner', 'nd'],
				defaultsTo: 'nd',
				required: true
			},
			privileges: {
				type: 'integer',
				required: true
			},
      user: {
        model: 'user'
      }
		}
	});
