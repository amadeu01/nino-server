var api_key = 'key-febe2f50d1b01f0e641d58f04e91a2f3';
var domain = 'ninoapp.com.br';
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
var uid = require('uid-safe')
 
var data = {
  from: 'Myself <naoresponda@ninoapp.com.br>',
  to: 'carloseduardomillani@gmail.com',
  subject: 'Hello',
  text: 'Testing some Mailgun awesomness!'
};

var MailgunServices = {
	sendMail : function() {
    var promise = new Promise( function(resolve, reject) {
			mailgun.messages().send(data, function (error, body) {
				if (error) {
					reject(error);
				} else {
					resolve(body);
				}
			});
    });
    return promise;
	},
	sendUserConfirmation: function(userMail, uid) {
    var promise = new Promise( function(resolve, reject) {
			var link = 'www.ninoapp.com.br/confirmation/' + uid;
			var message = {
			  from: 'Nino <naoresponda@ninoapp.com.br>',
			  to: userMail,
			  subject: 'Confirmação de usuário',
			  html: 'Use esse link:' + link //TODO: Escrever html direito fii
			};
			mailgun.messages().send(message, function (error, message) {
				if (error) {
					reject(error);
				} else {
					resolve(message);
				}
			});
    });
    return promise;
	}
};

module.exports = MailgunServices;