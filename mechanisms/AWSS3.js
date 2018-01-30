/**
* @author Amadeu Cavalcante
* @module mechanisms
*/

var aws = require('aws-sdk');
var s3 = new aws.S3();

var awsMec = {};

var profilePicBucket = 'ninoapp-profiles-files-01';
var logotypeBucket = 'ninoapp-logotype-files-01';
var picturesBucket = 'ninoapp-pictures-files-01';

var contentsBucket = 'ninoapp-contents-files-01';

awsMec.uploadProfilePic = function(file, name, size) {
	return awsMec.upload(file, name, profilePicBucket, size);
};

awsMec.uploadLogotype = function(file, name, size) {
	return awsMec.upload(file, name, logotypeBucket, size);
};

awsMec.uploadContent = function(file, name, size) {
	return awsMec.upload(file, name, contentsBucket, size);
};

awsMec.upload = function(file, name, bucket, size) {
	return new Promise(function(resolve, reject) {
		var params = {
			Bucket: bucket, /* required */
			Key: name, /* required */
			ACL: 'private',
			Body: file,
			ContentLength: size
		};
		s3.putObject(params, function(err, data) {
			if (err) reject(err);
			else     resolve(data);
		});
	}).catch(function(err) {
		reject(err);
	});
};

awsMec.downloadProfilePic = function(name) {
	return awsMec.download(name, profilePicBucket);
};

awsMec.downloadLogotype = function(name) {
	return awsMec.download(name, logotypeBucket);
};

awsMec.downloadContent = function(name) {
	return awsMec.download(name, contentsBucket);
};

awsMec.download = function(name, bucket) {
	return new Promise(function(resolve, reject) {
		imgStream = s3.getObject({
			Bucket: bucket,
			Key: name
		}).createReadStream();
		resolve(imgStream);
	}).catch(function(err) {
		reject(err);
	});
};

awsMec.deleteContent = function(name) {
	return awsMec.delete(name, contentsBucket);
};

awsMec.delete = function(name, bucket) {
	return new Promise(function(resolve, reject) {
		var params = {
			Bucket: bucket, /* required */
			Key: name, /* required */
		};
		s3.deleteObject(params, function(err, data) {
			if (err) reject(err);
			else     resolve(data);
		});
	}).catch(function(err) {
		reject(err);
	});
};

module.exports = awsMec;
