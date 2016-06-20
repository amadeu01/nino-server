/**
 * http://gruntjs.com/configuring-tasks
 */
module.exports = function (grunt) {
    var path = require('path');
    var NINO_PATH = 'ninoAPI/';
    var NINO_API_PATH = 'api';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        connect: {
            options: {
                hostname: '*'
            },
            nino: {
                options: {
                    port: 8000,
                    base: NINO_PATH,
                    middleware: function (connect, options) {
                        return [
                            require('connect-livereload')(),
                            connect.static(path.resolve(options.base))
                        ];
                    }
                }
            }
        },

        watch: {
            options: {
                livereload: true
            },
            less: {
                files: ['less/**/*.less'],
                tasks: ['less']
            },

            lesscopy: {
                files: ['static/styles/jaguar.css'],
                tasks: ['copy:css']
            },

            jscopy: {
                files: ['static/scripts/main.js'],
                tasks: ['copy:js']
            },

            jsdoc: {
                files: ['**/*.tmpl', '*.js'],
                tasks: ['jsdoc']
            },

            nino: {
                files: ['api/**/*.js'],
                tasks: ['nino']
            }
        },

        clean: {
            nino: {
                src: NINO_PATH
            }
        },

        jsdoc: {
            nino: {
                src: [
                    NINO_API_PATH + '/business/*.js',
                    NINO_API_PATH + '/mechanisms/*.js',
                    NINO_API_PATH + '/persistence/*.js',

                    // You can add README.md file for index page at documentations.
                    'README.md'
                ],
                options: {
                    verbose: true,
                    destination: NINO_PATH,
                    configure: 'conf.json',
                    template: './',
                    'private': false
                }
            }
        },

        less: {
            dist: {
                src: 'less/**/jaguar.less',
                dest: 'static/styles/jaguar.css'
            }
        },

        copy: {
            css: {
                src: 'static/styles/jaguar.css',
                dest: NINO_PATH + '/styles/jaguar.css'
            },

            js: {
                src: 'static/scripts/main.js',
                dest: NINO_PATH + '/scripts/main.js'
            }
        }
    });

    // Load task libraries
    [
        'grunt-contrib-connect',
        'grunt-contrib-watch',
        'grunt-contrib-copy',
        'grunt-contrib-clean',
        'grunt-contrib-less',
        'grunt-jsdoc',
    ].forEach(function (taskName) {
        grunt.loadNpmTasks(taskName);
    });

    // Definitions of tasks
    grunt.registerTask('default', 'Watch project files', [
        'nino',
        'connect:nino',
        'watch'
    ]);

    grunt.registerTask('nino', 'Create documentations for Nino', [
        'less',
        'clean:nino',
        'jsdoc:nino'
    ]);
};
