/**
* Amadeu Cavalcante
* Module for Roles
*/
var mysqlAdapter = require('sails-mysql');
var myDiskAdapter = require('sails-disk');

module.exports = {
  // setup adapters for each type of database
  //I do not know which db will be used, so for test's sake I used more than one.
  adapters: {
    'default': mysqlAdapter,
    'mysql': sailsMySQLAdapter,
    disk: myDiskAdapter,
    mysql: mysqlAdapter
  },
  // setup all type of connections you could have
  connections: {
    // NinoDB
    default: {
  				adapter: 'mysql',
  				host: 'ninodbinstance.cwtfdu1insah.sa-east-1.rds.amazonaws.com',
  				user: 'ninodbuser',
  				password: 'CfJ-Cur-69S-pNz',
  				database: 'NinoDB'
  			},
    //using sails-disk method
    diskLocal: {
        adapter: 'disk'
    }
  },
};
