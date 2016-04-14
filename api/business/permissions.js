module.exports = {
	validate : function(permission) {
		if (permission < 1<<18) return true;
		else return false;
	},
	all : function() {
		var maxPermission = 0;
		for (var item in this.types) {
			maxPermission |= this.types[item];
		}
		return maxPermission;
	},
	types: {
		readAllSchoolStudents: 1 << 0,
		createUpdateSchoolStudents: 1 << 1,
		deleteSchoolStudents: 1 << 2,
	
		readAllSchoolEducators: 1 << 3,
		createUpdateSchoolEducators: 1 << 4,
		deleteSchoolEducators: 1 << 5,
	
		readAllSchoolClassrooms: 1 << 6,
		createUpdateSchoolClassroom: 1 << 7,
		deleteSchoolClassroom: 1 << 8,
	
		manageMyClassroomsStudents: 1 << 9,
		manageMyClassroomsEducators: 1 << 10,
		manageAllSchoolBabiesGuardians: 1 << 11,
		manageSchool: 1 << 12,
	
		sendAnnouncements: 1 << 13,
		readPictures: 1 << 14,
		sendPictures: 1 << 15,
		sendSchedules: 1 << 16,
		sendMessages: 1 << 17
	},
	check: function(required, available){
		if ((required & available) == required) return true;
		else return false;
	}
};
