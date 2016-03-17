/**
* Amadeu Cavalcante
* Module for Guardians
*/

var Waterline = require('waterline');

module.exports = Waterline.Collection.extend({
	identity : 'guardian',
	connection: 'default',
	attributes: {
    id: {
      type: 'integer',
      primaryKey: true,
      autoIncrement: true
    },
    student: {
      collection: 'student'
      via: 'guardians'
      index: true
    },
    role: {model: 'role'}

  }
