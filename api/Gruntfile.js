module.exports = function(grunt) {
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.initConfig({
		jshint: {
   			all: ['Gruntfile.js', 'routes/**/*.js', 'bin/**/*.js', 'app.js']
  		}
	});
	grunt.registerTask('default', ['jshint']);
};
