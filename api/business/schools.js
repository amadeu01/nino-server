/** @module business/schools */

var validator = require('validator');
var response = require('../mechanisms/response.js') ;
var activitiesDAO = require('../persistence/schools.js');
var schools = {};

schools.createSchool = function() {
	//TODO: func do BO que vai validar as coisas e mandar o DAO criar. O route ta fazendo boa parte da validação, separa isso depois de modo que lá só verifique se existe e aqui valide :)
}
