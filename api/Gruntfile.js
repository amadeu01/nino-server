module.exports = function(grunt) {
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.initConfig({
		jshint: {
   			all: ['Gruntfile.js','test/*.js', 'services/*.js', 'routes/**/*.js', 'bin/**/*.js', 'app.js', 'models/**']
  		}
	});
	grunt.registerTask('default', ['jshint']);
};
