/**
* Amadeu Cavalcante
* Module for models warterline
*/

var config = {
	connectionString: process.env.DATABASE_URL,
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
