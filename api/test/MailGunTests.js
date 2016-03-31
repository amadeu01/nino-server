/**
* Carlos Millani
* Module services
*/

var assert = require('assert');
var mgs = require('../MailgunServices.js');

suite('Mail Services', function () {

  test('Sending confirmation Mail', function () {
		return mgs.sendUserConfirmation('carloseduardomillani@gmail.com', {
			title: 'Ola',
			message: 'Confirme email',
			url: 'www.ninoapp.com.br/UID'
		})
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
