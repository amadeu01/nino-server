// /**
// * Carlos Millani
// * Module services
// */
//
// var assert = require('assert');
// var mgs = require('../mechanisms/mail.js');
// var uid = require('uid-safe');
//
// suite('Mail Services', function () {
//
//   test('Sending confirmation Mail', function () {
// 				this.timeout(5000);
//    		return mgs.sendUserConfirmation('danilobecke@gmail.com', {
//    			hash: uid.sync(100)
//    		})
//    		.then(function(success) {
//    			console.log(success);
//    			assert.equal(true, true, 'Uhull');
//    		})
//    		.catch(function(error) {
//    			console.log(error);
//    			assert.equal(false, true, 'Deu ruim parça');
//    		});
//    	});
//
//   // test('Registering to list', function () {
// // 		this.timeout(5000);
// // 		return mgs.subscribeToFeed('carloseduardomillani@gmail.com', 'Carlos Eduardo', {
// // 			title: 'Ola',
// // 			message: 'Confirme email',
// // 			url: 'www.ninoapp.com.br/UID'
// // 		})
// // 		.then(function(success) {
// // 			// console.log(success);
// // 			return mgs.unsubscribeToFeed('carloseduardomillani@gmail.com', success.member.vars.unsubshash);
// // 			// assert.equal(true, true, 'Uhull');
// // 		})
// // 		.catch(function(error) {
// // 			// console.log(error);
// // 			assert.equal(false, true, 'Deu ruim parça');
// // 		});
// // 	});
//
// });
