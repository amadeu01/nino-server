/**
* Amadeu Cavalcante
* Module for models warterline
*/
var mysqlAdapter = require('sails-mysql');
var myDiskAdapter = require('sails-disk');
var Waterline = require('waterline');
var orm = new Waterline();
var config = {
  // setup adapters for each type of database
  //I do not know which db will be used, so for test's sake I used more than one.
  adapters: {
    'default': mysqlAdapter,
    'disk': myDiskAdapter
  },
  // setup all type of connections you could have
  connections: {
    // NinoDB
    // default: {
    //   				adapter: 'default',
    //   				host: 'ninodbinstance.cwtfdu1insah.sa-east-1.rds.amazonaws.com',
    //   				user: 'ninodbuser',
    //   				// password: 'CfJ-Cur-69S-pNz',
    //   				database: 'NinoDB'
    //   			},
    //using sails-disk method
    default: {
        adapter: 'disk'
    }
  },
};

var fs = require('fs');
var path = require("path");

fs.readdirSync(__dirname).filter(function(file) {
    return (file.indexOf(".") !== 0) && (file !== "index.js");
  }).forEach(function(file) {
    var model = require(path.join(__dirname, file));
    orm.loadCollection(model);
  });

module.exports = {waterline: orm, config: config};
