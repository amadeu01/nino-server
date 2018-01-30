/**
* Amadeu
* Module services
* last modified: Amadeu Cavalcante
*/

var assert = require('assert');
var models = require('../models');
var myDiskAdapter = require('sails-disk');
var sailsMemoryAdapter = require('sails-memory');

suite('Last Check of data', function () {

	setup(function (done) {

	    models.waterline.initialize(models.config, function  (err, ontology) {
	        if (err) {
	            return done(err);
	        }
	        done();
	    });
	});

  teardown(function () {
      var adapters = models.config.adapters || {};
      var promises = [];

      Object.keys(adapters)
          .forEach(function (adapter) {
              if (adapters[adapter].teardown) {
                  var promise = new Promise(function (resolve) {
                      adapters[adapter].teardown(null, resolve);
                  });
                  promises.push(promise);
              }
          });

      return Promise.all(promises);
  });

  test('should generate data results for school ', function () {
    var schoolServices = require('../services/schools.js');
    var educatorServices = require('../services/educators');
    var fs = require('fs');
    return schoolServices.readComplete({id: 1})
    .then(function(school){
      var data = "\n\n########################## - School Read Complete - #########################\n\n";
      data += "School : " + school.name + "Id:" + school.id + "\n" + JSON.stringify(school.owner);
      data += "\n\n########################## - Students - #########################\n\n";
      data += "\nStudents\n" + JSON.stringify(school.students);
      data += "\n\n########################## - Educators - #########################\n\n";
      data += "\nEducators\n" + JSON.stringify(school.educators);
      data += "\n\n########################## - Classrooms - #########################\n\n";
      data += "\nClassrooms\n" + JSON.stringify(school.classrooms);
      data += "\n\n########################## - Next - #########################\n\n";
      return educatorServices.readComplete({id: 1})
      .then(function(result){
				var educator = result.educator;
        data += "\n\n########################## - Educators Read Complete - #########################\n\n";
        data += "Educator id: " + JSON.stringify(educator.id);
				data += "\n\n########################## - Classrooms - #########################\n\n";
				data += "Classrooms:\n" + JSON.stringify(educator.classrooms);
				data += "\n\n########################## - School - #########################\n\n";
				data += "School:\n" + JSON.stringify(educator.school);
				data += "\n\n########################## - Role - #########################\n\n";
				data += "Role:\n" + JSON.stringify(educator.role);
				data += "\n\n########################## - Next - #########################\n\n";

				//School's owner
				var role = result.role;
				data += "\n\n########################## - Owner's Role Read Complete - #########################\n\n";
        data += "Role: " + JSON.stringify(role.id) + "\nPrivileges: " + JSON.stringify(role.privileges);
				data += "\n\n########################## - Owner Read Complete - #########################\n\n";
        data += "Owner: \n" + JSON.stringify(role.owner);
        return fs.writeFile(".tmp/Results_for_school.txt", data, 'utf8', function(err) {
          if(err) {
            return console.log(err);
          }
          console.log("The file results was saved!");
        });
      });
    });
  });

	test('should generate data results for classroom ', function (){
		var classroomServices = require('../services/rooms.js');
		var fs = require('fs');
		return classroomServices.readComplete({id: 1})
		.then(function(classroom){
			var data = "\n\n########################## - Classroom Read Complete - #########################\n\n";
			data += "Classroom id: " + JSON.stringify(classroom.id);

			data += "\n\n########################## - School - #########################\n\n";
			data += "School:\n" + JSON.stringify(classroom.school);

			data += "\n\n########################## - Educators - #########################\n\n";
			data += "Educators:\n" + JSON.stringify(classroom.educators);

			data += "\n\n########################## - Students - #########################\n\n";
			data += "Students:\n" + JSON.stringify(classroom.students);
			return fs.writeFile(".tmp/Results_for_classroom.txt", data, 'utf8', function(err) {
				if(err) {
					return console.log(err);
				}
				console.log("The file results was saved!");
			});
		});
	});

	test('should generate description data', function() {
		var classroomServices = require('../services/rooms.js');
		var educatorServices = require('../services/educators');
		var guardianServices = require('../services/guardian');
		var schoolServices = require('../services/schools.js');
		var fs = require('fs');

		return guardianServices.description({id: 1})
		.then(function(guardian){
			return schoolServices.description({id: 1})
			.then(function(school){
				var data = guardian + "\n\n" + school;
				return fs.writeFile(".tmp/Results_for_description.txt", data, 'utf8', function(err) {
					if(err) {
						return console.log(err);
					}
					console.log("The file for descriptions was saved!");
				});
			});
		});
	});

});
