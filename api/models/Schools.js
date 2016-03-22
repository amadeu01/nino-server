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
    owner: {
      model: 'user',
      via: 'school'
    },
    email: {
      type: 'string',
      size: 50,
      unique: true,
      required: true
    },
    //reference to s3
    logotype: {
      type: 'string'
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
    educators: {
      collection: 'educator',
      via: 'school'
    },
    students: {
      collection: 'student',
      via: 'school'
    },
    classrooms: {
      collection: 'classroom',
      via: 'school'
    },
    active: {
      type: 'boolean'
    }
  }
});
