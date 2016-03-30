var api_key = 'key-febe2f50d1b01f0e641d58f04e91a2f3';
var domain = 'ninoapp.com.br';
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
 
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
	}
};

module.exports = MailgunServices;