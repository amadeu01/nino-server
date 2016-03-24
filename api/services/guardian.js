var models = require('../models');
var User = models.waterline.collections.user;
var Guardians = models.waterline.collections.guardian;
var Role = models.waterline.collections.role;
var guardiansServices = {
	create: function(parameters) {
		return User.create({
			name: parameters.name,
			surname: parameters.surname,
			username: parameters.username,
			password: parameters.password,
			email: parameters.email,
			cel: parameters.cel,
			confirmed: parameters.confirmed
		}).then(function (user) {
				return Roles.create({
					role: 'guardian',
					privileges: '1',
					user: user.id,
					type: 'parent'
				}).then(function(role){
					user.role = [role];
					return Device.create({
							arn: 'asfnancabprwuei1924830149324',
							description: 'Here some description',
							enable: true,
							user: user.id,
						}).then(function(device) {
							user.device = [device];
							return Credential.create({
									user: user.id,
									devices: device.id
								}).then(function(credential){
									user.credential = [credential];
									credential.devices = [device];
									role.save();
									device.save();
									credential.save();
									assert.equal(user.name, 'Neil', 'should have set the first name');
									assert.equal(user.surname, 'Armstrong', 'should have set the last name');
									assert.equal(user.devices.length, 0, 'There is no device');
									var datTemp = user.toJSON();
									console.log(datTemp);
									return user.save();
								});
						});
				});
		});
});
	},
	delete: function() {

	},
	read: function() {

	},
	update: function() {

	}
};

module.exports = guardiansServices;
