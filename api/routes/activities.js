/** router/activities
*
* Last to modify: Amadeu Cavalcante
*/

var express = require('express');
var router = express.Router();
var errors = require('../mechanisms/error');
var validator = require('validator');
var activitiesBO = require('../business/activities.js');
var useragent = require('express-useragent');

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
	return new Promise(function(resolve, reject) {
		if (req.body.school === undefined) reject(errors.missingParameter('School'));
		else if (req.body.name === undefined) reject(errors.missingParameter('name'));
		else if (req.token === undefined) reject(errors.missingParameter('token'));
		else if (req.params.description === undefined ) reject(errors.missingParameter('description'));
		else {
			var device = req.useragent.Platform + " " + req.useragent.OS;
			return activitiesBO.createActivityToSchool(req.body.school, req.params.description, device, req.rawToken)
			.then(function(activity){
				res.status(200);
				res.send(activity);
				resolve(activity);
			}).catch(function(err) {
				res.status(err.code);
				res.send(err);
				reject(err);
			});
		}
	});
});

/**
* @description Add activity to class
*/
router.post("/:activity/classes/:class_id", function(req, res) {
	//TODO: To adotando o seguinte padrao: quando um parametro de modelo é obrigatório eu boto ele na rota :)
	//TODO: ve no server antigo, eu usava o numberValidate pra validar se é número, ve como eu usava :)
	return new Promise(function(){
		if (req.body.school === undefined) reject(errors.missingParameter('school_id'));
		else if (req.params.activity === undefined) reject(errors.missingParameter('activity_id'));
		else if (req.token === undefined) reject(errors.missingParameter('token'));
		else if (req.params.class_id === undefined ) reject(errors.missingParameter('class_id'));
		else {
			var device = req.useragent.Platform + " " + req.useragent.OS;
			return activitiesBO.addActivityToClass(req.body.school, req.params.class_id, req.params.activity, device, req.rawToken)
			.then(function(activity){
				res.status(200);
				res.send(activity);
				resolve(activity);
			}).catch(function(err) {
				res.status(err.code);
				res.send(err);
				reject(err);
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
		else if (req.token === undefined) reject(errors.missingParameter('token'));
		else {
			return activitiesBO.getActivitiesForSchool(req.body.school, req.rawToken)
			.then(function(activities){
				res.status(200);
				res.send(activities);
				resolve(activities);
			}).catch(function(err) {
				res.status(err.code);
				res.send(err);
				reject(err);
			});
		}
	})
});

/**
* @description get activities for Class
*/
router.get("/:class", function(req, res) {
	return new Promise(function(){
		if (req.params.class === undefined) reject(errors.missingParameter('Class'));
		else if (req.token === undefined) reject(errors.missingParameter('token'));
		else {
			return activitiesBO.getActivitiesForClass(req.body.class, req.rawToken)
			.then(function(activity){
				res.status(200);
				res.send(activity);
				resolve(activity);
			}).catch(function(err) {
				res.status(err.code);
				res.send(err);
				reject(err);
			});
		}
	})
});


module.exports = router;
