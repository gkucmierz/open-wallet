'use strict';

module.exports = function (grunt) {

    var prepareSassFiles = function(pattern) {
        return grunt.file.expandMapping([pattern], null, {
            rename: function (dest, matchedSrcPath) {
                var path = matchedSrcPath.replace('scss/', 'css/');
                return path.substring(0, path.length - 5) + '.css';
            }
        });
    };
    var sassFiles = prepareSassFiles('scss/style.scss');

    grunt.initConfig({
        sass: {
            all: {
                options: {
                    style: 'expanded',
                    sourcemap: true,
                    trace: true
                },
                files: sassFiles
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                'Gruntfile.js',
                'scripts/{,*/}*.js'
            ]
        },
        watch: {
            sass: {
                files: [
                    'scss/*.scss'
                ],
                tasks: ['sass']
            },
            livereload: {
                files: [
                    'css/*.css'
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.registerTask('compile', ['sass']);
    grunt.registerTask('lint', ['jshint']);

    grunt.registerTask('default', [
        'sass',
        'lint'
    ]);
};