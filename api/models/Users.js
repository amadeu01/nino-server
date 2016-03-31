/**
* Amadeu Cavalcante
* Module for Users
*/
/**
 Model:
 Users -
 Has an association to Roles, Authentications and Devices
*/
var Waterline = require('waterline');
// For applying hash to password
var bcrypt = require('bcrypt');
//To create an unique id to refer to that user
var uid = require('uid-safe')
//User model
module.exports = Waterline.Collection.extend({
	identity : 'user',
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
		surname: {
			type: 'string',
			size: 40,
			required: true
		},
		//must apply hash to it
		password: {
			type: 'string',
			size: 100,
			required: true
		},
		email: {
			type: 'string',
			size: 50,
			unique: true,
			required: true,
			index: true
		},
		cel: {
			type: 'string',
			required: true
		},
		confirmed: {
			type: 'boolean'
		},
		confirmationUID: {
			type: 'string',
			unique: true,
			index: true
		},
		roles: {
			collection: 'role',
			via: 'owner'
		},
		credentials: {
			collection: 'credential',
			via: 'owner'
		},
		devices: {
			collection: 'device',
			via: 'owner'
		},
		toJSON: function() {
      var obj = this.toObject();
      delete obj.password;
      return obj;
    },
		/* For applying hash to password
		beforeCreate: function(values, next){
    var bcrypt = require('bcrypt');

    bcrypt.genSalt(10, function(err, salt) {
      if (err) return next(err);

      bcrypt.hash(values.password, salt, function(err, hash) {
        if (err) return next(err);

        values.password = hash;
        next();
      });
    });
  },
	*/
		// I don't know if this is applicable
		validPassword: function(password) {
			return (password == this.toObject().password);
		}
	},
	beforeCreate: function (values, cb) {
    values.confirmationUID = uid.sync(100);
    cb();
  }
});
