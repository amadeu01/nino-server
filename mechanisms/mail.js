/**
* @author Carlos Millani
* @module mechanisms
*/

var api_key = process.env.MAIL_GUN_API_KEY;
var domain = 'ninoapp.com.br';
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
var uid = require('uid-safe');
var app = require('../app');
var feedlist = mailgun.lists('noticias@ninoapp.com.br');
var userslist = mailgun.lists('usuarios@ninoapp.com.br');

var data = {
  from: 'Myself <naoresponda@ninoapp.com.br>',
  to: 'amadeu01@gmail.com',
  subject: 'Hello',
  text: 'Testing some Mailgun awesomness!'
};

/**
*@class
*/
var MailgunServices = {

	sendUserRecover: function(userMail, parameters) {
		var promise = new Promise( function(resolve, reject) {
			app.render('recover_email', parameters, function(error, html) {
				if (error) reject(error);
				var message = {
				  from: 'Nino <naoresponda@ninoapp.com.br>',
				  to: userMail,
				  subject: 'Recuperacao de Senha',
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
	},

  /**
  * @function
  * @param userMail
  * @param parameters
  */
	sendUserConfirmation: function(userMail, parameters) {
		var promise = new Promise( function(resolve, reject) {
			app.render('email', parameters, function(error, html) {
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
	},
  /**
  * @description subscribe email to maillist 
  * @param email
  * @param name
  * @param vars
  */
	subscribeToFeed: function(email, name, vars) {
		return new Promise( function(resolve, reject) {
			vars.unsubshash = uid.sync(50);
			var newUser = {
			  subscribed: true,
			  address: email,
			  name: name,
			  vars: vars
			};
			feedlist.members().create(newUser, function (err, data) {
			  // console.log(data);
				if (err) reject(err);
				else resolve(data);
			});
		});
	},
	unsubscribeToFeed: function(email, hash) {
		return new Promise( function(resolve, reject) {
			feedlist.members(email).update({},function(err, body) {
				if (body.member.vars.unsubshash === hash) {
					feedlist.members(email).delete(function(err, body) {
						resolve(body);
					});
				} else {
					reject();
				}
			});
		});
	},
	subscribeUser: function(email, name, vars) {
		return new Promise( function(resolve, reject) {
			vars.unsubshash = uid.sync(50);
			var newUser = {
			  subscribed: true,
			  address: email,
			  name: name,
			  vars: vars
			};
			userslist.members().create(newUser, function (err, data) {
			  // console.log(data);
				if (err) reject(err);
				else resolve(data);
			});
		});
	},
	unsubscribeUser: function(email) {
		return new Promise( function(resolve, reject) {
			userslist.members(email).update({ subscribed: false }, function(err, body) {
				if (err) reject(err);
				else resolve(body);
			});
		});
	}
};

module.exports = MailgunServices;
