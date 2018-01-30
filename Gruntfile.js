module.exports = function(grunt) {
	grunt.initConfig({
		jshint: {
			all: ['Gruntfile.js','test/*.js', 'routes/**/*.js', 'bin/**/*.js', 'app.js', 'persistence/**/*.js', 'bin/www', 'mechanisms/**/*.js', 'business/**/*.js']
		},
		clean: {
				nino: {
						src: "nino-doc"
				}
		},
		jsdoc: {
				nino: {
						src: [
								'README_NINO.md'
						],
						options: {
								verbose: true,
								destination: 'nino-doc',
								configure: 'nino.conf.json',
								'private': false
						}
					}
				},
		shell: {
			mocha: {
				command: 'mocha'
			},
			openDoc: {
				command: 'open nino-doc/index.html'
			}
		}
	});

	// Load task libraries
	[
			'grunt-shell',
			'grunt-contrib-jshint',
			'grunt-contrib-copy',
			'grunt-contrib-clean',
			'grunt-jsdoc'
	].forEach(function (taskName) {
			grunt.loadNpmTasks(taskName);
	});

	// Definitions of tasks
	grunt.registerTask('default', ['jshint', 'shell']);
	grunt.registerTask('doc', 'Create documentations for Nino', [
		'clean:nino',
		'jsdoc:nino',
	]);
};
