/**
* Carlos Millani
* Module services
*/

var assert = require('assert');
var mgs = require('../MailgunServices.js');

suite('Mail Services', function () {

  test('Just DO it', function () {
		return mgs.sendMail()
		.then(function(success) {
			console.log(success);
			assert.equal(true, true, 'Uhull');
		})
		.catch(function(error) {
			console.log(error);
			assert.equal(false, true, 'Deu ruim parça');
		})
	});

});
