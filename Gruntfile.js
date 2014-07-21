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
        'lint',
        'sass'
    ]);

    // git hooks registration
    grunt.registerTask('install-hooks', function () {
        var fs = require('fs');

        // precommit hook is inside the repo as /hooks/pre-commit
        // copy the hook file to the correct place in the .git directory
        grunt.file.copy('hooks/pre-commit', '.git/hooks/pre-commit');

        // chmod the file to readable and executable by all
        fs.chmodSync('.git/hooks/pre-commit', '755');

        // do the same with post-update hook
        grunt.file.copy('hooks/post-merge', '.git/hooks/post-merge');
        fs.chmodSync('.git/hooks/post-merge', '755');
    });


    // fill missing translations
    (function() {
        var fs = require('fs');

        var deepEach = function callee(obj, fn, chain) {
            chain = chain && chain + '.' || '';
            // chain += '.';
            for (var i in obj) {
                if (obj.hasOwnProperty(i)) {
                    if (typeof obj[i] === 'object') {
                        callee(obj[i], fn, chain + i);
                    } else {
                        fn(obj[i], i, chain + i);
                    }
                }
            }
        };

        var pick = function(obj, chain) {
            var src = chain.split('.');
            var res = obj;

            for (var i = 0, l = src.length; i < l; ++i) {
                if (!(src[i] in res)) {
                    return void(0);
                }
                res = res[src[i]];
            }
            return res;
        };

        var put = function(obj, chain, value) {
            var src = chain.split('.');
            var res = obj;
            
            for (var i = 0, l = src.length; i < l; ++i) {
                if (!(src[i] in res)) {
                    res[src[i]] = {};
                }
                if (i + 1 === l) {
                    res[src[i]] = value;
                } else {
                    res = res[src[i]];
                }
            }
        };

        var fillTranslations = function(source, file) {
            var dest = JSON.parse(fs.readFileSync(file));
            var clean = {};

            deepEach(source, function(val, key, chain) {
                var destVal = pick(dest, chain);
                var sourceVal = pick(source, chain);

                if (typeof destVal === 'undefined' || destVal === convert(sourceVal)) {
                    put(clean, chain, convert(sourceVal));
                } else {
                    put(clean, chain, destVal);
                }
            });

            console.log('processing: ' + file);

            fs.writeFileSync(file, JSON.stringify(clean, null, '    '));
        };

        var convert = function(str) {
            return (str+'').replace(/\w/g, '-');
        };

        grunt.registerTask('i18n', function () {
            var dir = 'i18n';

            var files = fs.readdirSync(dir);
            var source = JSON.parse(fs.readFileSync(dir + '/locale-us.json'));

            files.filter(function(file) {
                return !file.match(/us/);
            }).map(function(file) {
                fillTranslations(source, dir + '/' + file);
            });
        });
    })();
};
