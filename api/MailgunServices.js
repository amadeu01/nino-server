var api_key = 'key-febe2f50d1b01f0e641d58f04e91a2f3';
var domain = 'ninoapp.com.br';
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
var uid = require('uid-safe');
var app = require('./app')
 
var data = {
  from: 'Myself <naoresponda@ninoapp.com.br>',
  to: 'carloseduardomillani@gmail.com',
  subject: 'Hello',
  text: 'Testing some Mailgun awesomness!'
};

var MailgunServices = {
	sendUserConfirmation: function(userMail, parameters) {
		var promise = new Promise( function(resolve, reject) {
			app.render('confirmation', parameters, function(error, html) {
				if (error) reject(error);
				var message = {
				  from: 'Nino <naoresponda@ninoapp.com.br>',
				  to: userMail,
				  subject: 'Confirmação de usuário',
				  html: html
				};
				mailgun.messages().send(message, function (error, message) {
					if (error) {
						reject(error);
					} else {
						resolve(message);
					}
				});
			});
    });
    return promise;
	}
};

module.exports = MailgunServices;