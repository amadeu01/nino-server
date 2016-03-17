/**
* Amadeu Cavalcante
* Module for Roles
*/
var Waterline = require('waterline')

module.exports =  Waterline.Collection.extend({
  identity : 'credential',
  connection: 'default',
		attributes: {
			id: {
				type: 'integer',
				primaryKey: true,
				autoIncrement: true
			},
      username: {
  			type: 'string',
  			size: 100,
  			unique: true,
  			required: true
  			},
  		//must apply hash to it ?
  		password: {
  			type: 'string',
  			size: 100,
  			required: true
  		},
      user: {model: 'user'},
      device: {collection: 'device'}
    }
  })
