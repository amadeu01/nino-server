/**
* @author Amadeu Cavalcante
* @module mechanisms/AWSSNS
*/

var aws = require('aws-sdk');

var sns = new aws.SNS();

var awsMec = {};

module.exports = awsMec;