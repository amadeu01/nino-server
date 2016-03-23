module.exports = function(grunt) {
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.initConfig({
		jshint: {
   			all: ['Gruntfile.js','test/*.js', 'routes/**/*.js', 'bin/**/*.js', 'app.js', 'models/**/*.js', 'bin/www', 'services/**/*.js']
  		}
	});
	grunt.registerTask('default', ['jshint']);
};
