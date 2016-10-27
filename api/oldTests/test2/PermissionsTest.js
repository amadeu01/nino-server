// /**
// Author: Carlos Eduardo Millani
// Testing Permissions Module
// */
//
// var assert = require('assert');
// var permissions = require('../services/permissions');
//
// suite('Permissions', function () {
//
//     test('Check if user has ONE permission', function () {
// 			assert.equal(permissions.check(permissions.types.readAllSchoolStudents, 1<<0),
// 			true,
// 			permissions.types.readAllSchoolStudents + 'nao contido em' + 1<<0);
//
// 			assert.equal(permissions.check(permissions.types.readAllSchoolStudents, 1<<0 | 1<<1),
// 			true,
// 			permissions.types.readAllSchoolStudents + 'nao contido em' + 1<<0 | 1<<1);
//     });
//
// 		test('Check if fail when user doesnt have ONE permission', function() {
// 			assert.equal(permissions.check(permissions.types.readAllSchoolStudents, 0),
// 			false,
// 			permissions.types.readAllSchoolStudents + 'contido em' + 0);
//
// 			assert.equal(permissions.check(permissions.types.readAllSchoolStudents, 1<<1 | 1<<2 | 1<<4),
// 			false,
// 			permissions.types.readAllSchoolStudents + 'contido em' + 1<<1 | 1<<2 | 1<<4);
// 		});
//
// 		test('Check if user has MANY permission', function () {
// 			assert.equal(permissions.check(permissions.types.readAllSchoolStudents | permissions.types.createUpdateSchoolStudents, 1<<0 | 1<<1),
// 			true,
// 			permissions.types.readAllSchoolStudents + 'nao contido em' + 1<<0 | 1<<1);
//
// 			assert.equal(permissions.check(permissions.types.readAllSchoolStudents | permissions.types.createUpdateSchoolStudents, 1<<0 | 1<<1 | 1<<17),
// 			true,
// 			permissions.types.readAllSchoolStudents + 'nao contido em' + 1<<0 | 1<<1 | 1<<17);
// 		});
//
// 		test('Check if fail when user doesnt have MANY permission', function() {
// 			assert.equal(permissions.check(permissions.types.readAllSchoolStudents | permissions.types.createUpdateSchoolStudents, 1<<1),
// 			false,
// 			permissions.types.readAllSchoolStudents + 'nao contido em' + 1<<0 | 1<<1);
//
// 			assert.equal(permissions.check(permissions.types.readAllSchoolStudents | permissions.types.createUpdateSchoolStudents, 1<<17 | 1 << 13),
// 			false,
// 			permissions.types.readAllSchoolStudents + 'nao contido em' + 1<<0 | 1<<1 | 1<<17 | 1<<13);
// 		});
//
// 		test('Check validation', function () {
// 			var maxPermission = 0;
// 			for (var item in permissions.types) {
// 				maxPermission |= permissions.types[item];
// 			}
// 			assert.equal(permissions.validate(maxPermission), true, 'Permission error!');
// 		});
// });
