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
      owner: {
        model: 'user',
        required: true
      },
      devices: {
        collection: 'device',
        required: true
    	}
    }
  });
