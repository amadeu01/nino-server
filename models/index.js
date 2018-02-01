/**
* Amadeu Cavalcante
* Module for models warterline
*/

var config = {
	user: 'process.env.DATABASE_USER',
	password: 'process.env.DATABASE_PASSWORD',
	database: 'process.env.DATABASE_NAME',
	host: 'process.env.DATABASE_URL',
	port: 5432,
	max: 10,
	idleTimeoutMillis: 30000,
}

var fs = require('fs');
var path = require("path");
var models = [];
fs.readdirSync(__dirname).filter(function(file) {
    return (file.indexOf(".") !== 0) && (file !== "index.js");
  }).forEach(function(file) {
    var model = require(path.join(__dirname, file));
    models.push(model);
  });

module.exports = {models: models, config: config};
