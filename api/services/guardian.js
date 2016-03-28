var models = require('../models');
var User = models.waterline.collections.user;
var Guardians = models.waterline.collections.guardian;
var Roles = models.waterline.collections.role;
var Devices = models.waterline.collections.device;
var Credentials = models.waterline.collections.credential;

var guardiansServices = {
	create: function(parameters) {
		return User.create({
			name: parameters.name,
			surname: parameters.surname,
			password: parameters.password,
			email: parameters.email,
			cel: parameters.cel,
			confirmed: parameters.confirmed
		}).then(function (user) {
				return Roles.create({
					privileges: parameters.privileges,
					owner: user.id,
					type: 'guardian'
				}).then(function(role){
					user.roles = [role];
					return Devices.create({
						arn: 'asfnancabprwuei1924830149324',
						description: 'Here a mobile owned by a Guardian',
						enable: true,
						owner: user.id
						}).then(function(device) {
							user.devices = [device];
							return Credentials.create({
								owner: user.id,
								devices: device.id
							}).then(function(credential){
								user.credentials = [credential];
								credential.devices = [device];
								role.save();
								device.save();
								credential.save();
								return user.save();
							}).catch(function(err) {
								if (err) {
									console.log(err, err.stack);
								}
							});
					});
			});
		});
	},
	delete: function(parameters) {
		return User.destroy(parameters).then(function(users){
			console.log(users);
			var userIds = users.map(function(user){return user.id;});
			console.log(userIds);
			return Devices.destroy({owner: userIds}).then(function(devices){
				console.log(devices);
				return Credentials.destroy({owner: userIds}).then(function(credentials) {
					console.log(credentials);
					return Roles.destroy({owner: userIds}).then(function(roles) {
						console.log(roles);
					}).catch(function(err) {
						if (err) {
							return console.log(err);
						}
					});
				});
			});
		});

	},
	read: function(parameters) {
		//Find and populate with information all user matched with the given parameters
		return User.find(parameters).populate(['roles', 'credentials', 'devices']).then(function(users){
			if (users.length === 0) {
				throw Error('No user matched with the given parameters!');
			}
			return users;
		}).catch(function(err) {
			throw err;
		});
	},
	update: function(parameters, newParameters) {
		return User.find(parameters).then(function(users){
			if (users.length === 0 ) {
				throw Error('NO user was found');
			}
			if (users.length >= 2) {
				console.log(users.pop());
				throw Error('More than 1 user was found, it should be unique for changing.');
			}
			return User.update(parameters, newParameters).then(function(user){
				console.log(user);
			}).catch(function(err) {
				return console.log(err);
			});
		});
	}
};

module.exports = guardiansServices;
