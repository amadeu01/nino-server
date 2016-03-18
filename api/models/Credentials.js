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
      user: {model: 'user'},
      device: {collection: 'device'}
    }
  });
