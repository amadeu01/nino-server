var Waterline = require('waterline');

module.exports =  Waterline.Collection.extend({
  identity : 'key',
  connection: 'default',
		attributes: {
      email: {
        type: 'string',
        size: 100,
        required: true
      },
      password: {
        type: 'string',
        size: 100,
        required: true
      },
			active: {
				type: 'boolean',
				defaultsTo: true
			}
    }
  });
