/**
* @author Amadeu Cavalcante | Carlos Millani
* @description Model for account
*/

var Waterline = require('waterline');
//To create an unique id to refer to that user
var uid = require('uid-safe');

module.exports =  Waterline.Collection.extend({
  identity : 'account',
  connection: 'default',
		attributes: {
			id: {
				type: 'integer',
				primaryKey: true,
				autoIncrement: true
			},
			email: {
				type: 'string'
			},
			password: {
				type: 'string'
			},
			credentials: {
				collection: 'credential',
				via: 'account'
			},
			profile: {
				model: 'profile',
				required: true
			},
			cellphone: {
				type: 'string'
			},
			hash: {
				type: 'string'
			},
			confirmed: {
				type: 'boolean',
				defaultsTo: false
			},
			lost: {
				type: 'boolean',
				defaultsTo: false
			},
			active: {
				type: 'boolean',
				defaultsTo: true
			}
    },
  	beforeCreate: function (values, cb) {
      values.confirmationUID = uid.sync(100);
      cb();
    }
  });
