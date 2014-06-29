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
    var sassFiles = prepareSassFiles('scss/*.scss');

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

    grunt.registerTask('default', [
        'sass'
    ]);
};