var awss3 = require('../mechanisms/AWSS3.js');

suite('Account Profile and Credential Persistence', function () {
	
	setup(function (done) {
		done();
	});

	teardown(function () {
		return;
	});
	
	test('Should upload txt to S3', function() {
		awss3.uploadProfile("hahahahaha")
		// return awss3.uploadProfile(new Buffer.from('Testhehe'))
		.then(function(done) {
			console.log(done);
			return(done);
		}).catch(function(err) {
			console.log(err);
			throw(err);
		});
	});

});
	