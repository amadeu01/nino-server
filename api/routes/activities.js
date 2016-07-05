/*
*
* Last to modify: Amadeu Cavalcante
*/

var express = require('express');
var router = express.Router();
var errors = require('../mechanisms/error');
var validator = require('validator');
var activitiesBO = require('../business/activities.js');

var numberValidate = function(req, res, next, id) {
	if (!isNaN(id)) {
		next();
	} else {
		res.status(400).end(errors.invalidParameters("path_isNaN"));
	}
};

/**
* @description Create activity to school
*/
router.post('/:description', function(req, res, next) {
	//TODO: Aqui a rota ta certinha, voce usou o verbo http (post) pra descrever a ação e a rota pra descrever no que ele vai agir :)
	return new Promise(function(resolve, reject) {
		if (req.body.school === undefined) reject(errors.missingParameter('School'));
		else if (req.body.name === undefined) reject(errors.missingParameter('name'));
		else if (req.body.token === undefined) reject(errors.missingParameter('token'));
		else if (req.params.description === undefined ) reject(errors.missingParameter('description'));
		else {
			return activitiesBO.createActivityToSchool(req.body.school, req.params.description, req.body.token)
			.then(function(activity){
				res.status(response.status).json(response.json);
				resolve(response);
			}).catch(function(err) {
				res.status(error.status).json(error.json);
				var data = err.message + " Problem creating activities"
				reject(new response(400, data, 1));
			});
		}
	});
}); //TODO: faltou um parenteses aqui, lembra de sempre dar um `node bin/www` pra ver se não tem erro de sintaxe no codigo

/**
* @description Add activity to class
*/
router.post("/:activity/classes/:class", function(req, res) {
	//TODO: To adotando o seguinte padrao: quando um parametro de modelo é obrigatório eu boto ele na rota :)
	//TODO: ve no server antigo, eu usava o numberValidate pra validar se é número, ve como eu usava :)
	return new Promise(function(){
		if (req.body.school === undefined) reject(errors.missingParameter('School'));
		else if (req.params.activity === undefined) reject(errors.missingParameter('Activity ID'));
		else if (req.body.token === undefined) reject(errors.missingParameter('token'));
		else if (req.body.class === undefined ) reject(errors.missingParameter('description')); //TODO: nesse caso a class é origatoria e vem nos params
		else {
			return activitiesBO.addActivityToClass(req.body.school, req.params.activity, req.params.class, req.body.token)
			.then(function(activity){
				res.status(response.status).json(response.json);
				resolve(response);
			}).catch(function(err) {
				res.status(error.status).json(error.json);
				var data = err.message + " Problem creating Class"
				reject(new response(400, data, 1));
			});
		}
	})
});
/**
* @description get activities for School
*/
router.get("/:school", function(req, res) {
	return new Promise(function(){
		if (req.params.school === undefined) reject(errors.missingParameter('School'));
		else if (req.body.token === undefined) reject(errors.missingParameter('token'));
		else {
			return activitiesBO.getActivitiesForSchool(req.body.school, req.body.token)
			.then(function(activity){
				res.status(response.status).json(response.json);
				resolve(response);
			}).catch(function(err) {
				res.status(error.status).json(error.json);
				var data = err.message + " Problem creating Class"
				reject(new response(400, data, 1));
			});
		}
	})
});

/**
* @description get activities for Class
*/
router.get("/:class", function(req, res) {
	return new Promise(function(){
		if (req.params.class === undefined) reject(errors.missingParameter('School'));
		else if (req.body.token === undefined) reject(errors.missingParameter('token'));
		else {
			return activitiesBO.getActivitiesForClass(req.body.class, req.body.token)
			.then(function(activity){
				res.status(response.status).json(response.json);
				resolve(response);
			}).catch(function(err) {
				res.status(error.status).json(error.json);
				var data = err.message + " Problem creating Class"
				reject(new response(400, data, 1));
			});
		}
	})
});


module.exports = router;
