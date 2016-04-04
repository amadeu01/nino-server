var Waterline = require('waterline');

module.exports =  Waterline.Collection.extend({
  identity : 'subscription',
  connection: 'default',
		attributes: {
      email: {
        type: 'string',
        size: 100,
        required: true
      },
      language: {
        type: 'string'
      },
			unsubshash: {
				type: 'string',
				required: true
			},
			active: {
				type: 'boolean',
				defaultsTo: true
			}
    }
  });
