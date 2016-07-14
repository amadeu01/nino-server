var express = require('express');
var router = express.Router();
var app = require('../app');
var errors = require('../mechanisms/error');
var validator = require('validator');
var educatorsBO = require('../business/educators.js');

var numberValidate = function(req, res, next, id) {
	if (!isNaN(id)) {
		next();
	} else {
		res.status(400).end(errors.invalidParameters("path_isNaN"));
	}
};

/**@description Add educator to school */
router.post('/schools/:school_id', function(req, res, next){
	return new Promise(function(resolve, reject){
		if (req.token === undefined) reject(errors.missingParameters('token'));
		else if (req.rawToken === undefined) reject(errors.missingParameters('rawToken'));
		else if (req.params.school_id === undefined) reject(errors.missingParameters('school_id'));
		else if (req.body.profile_id === undefined) reject(errors.missingParameters('profile_id'));
		else {
			return educators.addEducatorToSchool(req.params.school_id, req.body.profile_id, req.rawToken, req.token)
			.then(function(response){
				res.status(response.code).json(response.json);
				resolve(classes);
			}).catch(function(err){
				res.status(err.code).json(err.json);
				reject(err);
			});
		}
	});
});

/**@description get educators for school */
router.get('/schools/:school_id/*', function(req, res, next){
	return new Promise(function(resolve, reject){
		if (req.token === undefined) reject(errors.missingParameters('token'));
		else if (req.rawToken === undefined) reject(errors.missingParameters('rawToken'));
		else if (req.params.school_id === undefined) reject(errors.missingParameters('school_id'));
		else {
			if (req.query.room === undefined) {
				return educators.getEducatorForSchool(school, req.rawToken, req.token)
				.then(function(response){
					res.status(response.code).json(response.json);
					resolve(classes);
				}).catch(function(err){
					res.status(err.code).json(err.json);
					reject(err);
				});
			} else {
				return educators.getEducatorForRoom(school, rawToken, token)
				.then(function(response){
					res.status(response.code).json(response.json);
					resolve(classes);
				}).catch(function(err){
					res.status(err.code).json(err.json);
					reject(err);
				});
			}
		}
	});
});

/**@description get educators for Room
* @param:
* School
* Class
* Room
* Token
@return:
* [Profile]
*
*/
router.delete('/schools/:school_id', function(req, res, next){
	return new Promise(function(resolve, reject){
		if (req.token === undefined) reject(errors.missingParameters('token'));
		else if (req.body.profile_id === undefined) reject(errors.missingParameters('profile_id'));
		else if (req.rawToken === undefined) reject(errors.missingParameters('rawToken'));
		else if (req.params.school_id === undefined) reject(errors.missingParameters('school_id'));
		else {
			return educators.removeEducatorFromSchool(req.params.school_id, req.body.profile_id, req.rawToken, req.token)
			.then(function(response){
				res.status(response.code).json(response.json);
				resolve(classes);
			}).catch(function(err){
				res.status(err.code).json(err.json);
				reject(err);
			});
		}
	});
});
// //Always check all path parameters for NaN error
// router.param('school_id', numberValidate);
// router.param('educator_id', numberValidate);
// router.param('room_id', numberValidate);
//
// /* Get users listing for a school. */
// router.get('/schools/:school_id', function(req, res, next) {
// 	//Check parameters
// 	if (req.body.user.name === undefined) res.status(400).json(errors.invalidParameters("user.name"));
// 	else {
// 		//Business
//
// 		//Send res
// 	  res.send('WIP');
// 	}
// });
//
// /* Create new Caretaker for that school */
// router.post('/schools/:school_id', function(req, res, next) {
// 	//Check parameters
// 	if (req.token === undefined) res.status(400).json(errors.invalidParameters("token"));
// 	else if (req.body.user.name === undefined) res.status(400).json(errors.invalidParameters("user.name"));
// 	else if (req.body.user.surname === undefined) res.status(400).json(errors.invalidParameters("user.surname"));
// 	else if (req.body.user.password === undefined) res.status(400).json(errors.invalidParameters("user.password"));
// 	else if (req.body.user.email === undefined || !validator.isEmail(req.body.user.email)) res.status(400).json(errors.invalidParameters("user.email"));
// 	else if (req.body.user.cel === undefined || !validator.isNumeric(req.body.user.cel)) res.status(400).json(errors.invalidParameters("user.cel"));
// 	else if (req.body.privileges === undefined || !validator.isNumeric(req.body.privileges)) res.status(400).json(errors.invalidParameters("privileges"));
// 	else {
// 		//Business
//
// 		//Send res
// 	  res.send('WIP');
// 	}
// });
//
//
// router.get('/rooms/:room_id', function(req, res, next) {
// 	//Check parameters
// 	if (req.token === undefined) res.status(400).json(errors.invalidParameters("token"));
// 	else {
// 		//Should now call business
//
// 		//End response
// 		res.send('WIP');
// 	}
// });
//
// /* Delete a caretaker */
// router.delete('/:educator_id', function(req, res, next) {
// 	//Check parameters
// 	if (req.token === undefined) res.status(400).json(errors.invalidParameters("token"));
// 	else {
// 		//Should now call business
//
// 		//End response
// 		res.send('WIP');
// 	}
// });
//
// /* Update a caretaker */
// router.put('/:educator_id', function(req, res, next) {
// 	//Check parameters
// 	if (req.token === undefined) res.status(400).json(errors.invalidParameters("token"));
// 	else if (req.body.school === undefined || !validator.isNumeric(req.body.school))
// 	{
// 		if (req.body.permissions === undefined || !validator.isNumeric(req.body.privileges)) {
// 			//Update req is empty
// 			res.status(400).json(errors.invalidParameters("Empty"));
// 		}
// 	}
// 	else {
// 		//Business
//
// 		//Send res
// 	  res.send('WIP');
// 	}
// });
//
module.exports = router;
