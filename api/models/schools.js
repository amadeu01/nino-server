/**
* Amadeu Cavalcante
* Module for Roles
*/
var Waterline = require('waterline');

module.exports =  Waterline.Collection.extend({
  identity : 'school',
  connection: 'default',
  attributes: {
    id: {
      type: 'integer',
      primaryKey: true,
      autoIncrement: true
    },
    owner: {
      model: 'profile',
    },
		employees: {
      collection: 'employee',
      via: 'school'
		},
		classes: {
			collection: 'class',
			via: 'school'
		},
		menus: {
			collection: 'menu',
			via: 'school'
		},
		activities: {
			collection: 'activity',
			via: 'school'
		},
		pedagogues: {
			collection: 'employee'
		},
		educators: {
			collection: 'employee'
		},
		nutritionists: {
			collection: 'employee'
		},
		coordinators: {
			collection: 'employee'
		},
		notificationGroup: {
			type: 'integer',
			required: true
		},
		address: {
			type: 'string'
		},
		cnpj: {
			type: 'string'
		}, 
		telephone: {
			type: 'string'
		},
		email: {
			type: 'string'
		},
		name: {
			type: 'string'
		},
		active: {
			type: 'boolean',
			defaultsTo: true
		}
	}
});
