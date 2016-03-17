/**
* Amadeu Cavalcante
* Module for Roles
*/
var Waterline = require('waterline');

module.exports =  Waterline.Collection.extend({
  identity : 'post',
  connection: 'default',
		attributes: {
			id: {
				type: 'integer',
				primaryKey: true,
				autoIncrement: true
			},
      attachment: {
        type: 'string',
        required: false
      },
      message: {
        type: 'string',
        required: true
      },
      date: {
        type: 'string',
        required: true,
        index: true
      },
      type: {
        type: 'string'
      },
      student: {
        collection: 'student',
        index: true
      },
      educator: {
        model: 'educator',
        index: true,
        required: true
      },
      school: {
        model: 'school',
        index: true,
        required: true
      }
    }
  });
