/**
* @author Amadeu Cavalcante
* @module mechanisms/AWSSNS
*/

var aws = require('aws-sdk');
aws.config.update({region:'sa-east-1'});

var sns = new aws.SNS();

var awsMec = {};

awsMec.sendToGroup = function(group_id) {
	
};

awsMec.notifyNewPostToDevices = function(device_listi, message) {
	return new Promise(function(resolve, reject) {
		var failure = 0;
		var success = 0;
		var snsHandler = function(err, data) {
			if (err) {
				failure++;
				console.log(err, err.stack); // an error occurred
			}  else {
				success++;
				console.log(data);           // successful response
			}
			if (success + failure == device_list.length) {
				resolve({success: success, failure: failure});
			} 
		};
		for (var i in device_list) {
			var params = {
				Message: {
					default: message,
					APNS_SANDBOX: {
						aps: {
							alert: message
						}
					},
					APNS: {
						aps: {
							alert: message
						}
					},
					GCM: {
						data: {
							message: message
						}
					}
				}, /* required */
				TargetArn: device_list[i],
				MessageStructure: "json"
			};
			sns.publish(params, snsHandler); 
			  
		}
	});
};

awsMec.createTopic = function(name) {
	
};

awsMec.createDevPlatformEndpoint = function(token) {
	return new Promise(function(resolve, reject){
		var params = {
		  PlatformApplicationArn: 'arn:aws:sns:sa-east-1:298405602780:app/APNS_SANDBOX/ios_nino_guardians_dev', /* required */
		  Token: token /* required */
		};
		sns.createPlatformEndpoint(params, function(err, data) {
		  if (err) {
				console.log(err, err.stack); // an error occurred
				reject(err);
			}
		  else {
				console.log(data);           // successful response
				resolve(data);
			}
		});
	});
};

module.exports = awsMec;
