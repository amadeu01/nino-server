/*
	Carlos Millani
	Password Resetting Tests
*/

var assert = require('assert');
var fake = require('Faker');
var app = require('../app.js');
var request = require('supertest');
var pool = require('../mechanisms/database.js').pool;

suite('Reset Lost Password', function() {
	test('Existing email', function() {
		return new Promise(function(resolve, reject) {
			request(app)
			.post('/accounts/authentication/password_reset')	
			.send({email:'danilobecke@gmail.com'})
			.expect(200)
			.end(function(err, res) {
				if (res.body.error !== null) {
					reject(new Error(res.body));
				} else {
					resolve(res);
				}
			});
		});	
	});

	test('Invalid email', function() {
		return new Promise(function(resolve, reject) {
			request(app)
			.post('/accounts/authentication/password_reset')	
			.send({email:'danilobecke_invalido@ninoapp.com'})
			.expect(200)
			.end(function(err, res) {
				if (res.body.error !== 100) { //Error 100 is not found - Should happen here
					reject(new Error(res.body));
				} else {
					resolve(res);
				}
			});
		});	
	});

	test('Reseting password', function() {
		return new Promise(function(resolve, reject) {
			var newPassword;
			pool.connect(function(err, client, done) {
				if (err) {
					reject(err);
					return;
				}
				client.query('SELECT passwordHash FROM accounts WHERE email = $1', ['danilobecke@gmail.com'], function(err, result) {
					request(app)
					.post('/accounts/authentication')
					.send({user: 'danilobecke@gmail.com', password: 'ninoapp1'})
					.end(function(err, res) {
						if (res.body.data.token) newPassword = 'ninoapp11';
						else newPassword = 'ninoapp1';
						console.log('New Password ', newPassword);
						request(app)
						.post('/accounts/authentication/password_reset/' + result.rows[0].passwordhash)
						.send({password: newPassword})
						.expect(200)
						.end(function(err, res) {
							if (res.body.data.token) resolve(res.body);
							else reject(res.body);
						});
					});
				});
			});	
		});
	});

//Falta tentar resetar com senha invalida
//Criar metodo de mudar variaveis de tempo e nao mexer com servicos externos tipo mail e AWS
//Tentar resetar fora do tempo, vide acima

});
