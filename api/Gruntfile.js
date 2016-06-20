module.exports = function(grunt) {
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-shell');
	grunt.loadNpmTasks('grunt-jsdoc');
	grunt.initConfig({
		jshint: {
   		all: ['Gruntfile.js','test/*.js', 'routes/**/*.js', 'bin/**/*.js', 'app.js', 'models/**/*.js', 'bin/www', 'services/**/*.js']
  	},
		shell: {
			cleanDB: {
				command: 'rm -rf .tmp/'
			},
			runMocha: {
				command: 'mocha'
			}
	});
	grunt.registerTask('default', ['jshint', 'shell']);
	grunt.registerTask('demo', 'Create documentations for demo', ['jsdoc:demo']);
};
