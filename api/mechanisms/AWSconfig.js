/** @module mechanisms */

var AWS = require('aws-sdk');
var AWSSNS = new AWS.SNS({region: 'sa-east-1'});
var AWSS3 = new AWS.S3();

/**
* @module mechanisms.AWSconfig
*/
module.exports = { sns: AWSSNS, s3: AWSS3 };
