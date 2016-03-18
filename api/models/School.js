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
    name: {
      type: 'string',
      size: 40,
      required: true
    },
    ownership: {
      type: 'integer'
    },
    email: {
      type: 'string',
      size: 50,
      unique: true,
      required: true
    },
    addr: {
      type: 'string',
      size: 100,
      required: true
    },
    cnpj: {
      type: 'string',
      size: 30
    },
    telephone: {
      type: 'string',
      size: 15
    },
    bucket: {
      type: 'string',
			size: 100,
			required: true
    },
    educators: {collection: 'educator'},
    students: {collection: 'student'},
    classrooms: {collection: 'classroom'}
  }
});
