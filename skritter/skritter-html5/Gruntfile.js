module.exports = function(grunt) {
    require('./www/config.js');

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-yuidoc');

    grunt.initConfig({
        /**
         * APPLICATION
         */
        application: grunt.file.readJSON('package.json'),
        /**
         * CLEAN
         */
        clean: {
            'build-docs': {
                src: ['build/docs'],
                options: {force: true}
            },
            'build-web': {
                src: ['build/web'],
                options: {force: true}
            },
            'nodemodules': {
                src: ['node_modules'],
                options: {force: true}
            }
        },
        /**
         * CSSLINT
         */
        csslint: {
            'all': {
                options: {
                    csslintrc: '.csslintrc',
                    import: 2
                },
                src: ['www/styles/style.css']
            }
        },
        /**
         * JSHINT
         */
        jshint: {
            'all': {
                options: {
                    jshintrc: '.jshintrc'
                },
                src: ['Gruntfile.js', 'www/application/**/*.js', 'www/framework/**/*.js']
            }
        },
        /**
         * HTMLMIN
         */
        htmlmin: {
            'build-web': {
                options: {
                    collapseWhitespace: true,
                    removeComments: true
                },
                expand: true,
                cwd: 'build/web/templates',
                src: ['**/*.html'],
                dest: 'build/web/templates'
            }
        },
        /**
         * REPLACE
         */
        replace: {
            'build-web': {
                options: {
                    variables: {
                        'version': '<%= application.version %>'
                    }
                },
                files: [
                    {src: 'Application.js', dest: 'build/web/application', expand: true, cwd: 'build/web/application'}
                ]
            }
        },
        /**
         * REQUIREJS
         */
        requirejs: {
            'build-web': {
                options: {
                    baseUrl: 'www',
                    dir: 'build/web',
                    fileExclusionRegExp: undefined,
                    generateSourceMaps: false,
                    keepBuildDir: false,
                    modules: app.configs.modules,
                    optimize: 'uglify',
                    optimizeCss: 'standard',
                    paths: app.configs.paths,
                    preserveLicenseComments: false,
                    removeCombined: true,
                    shim: app.configs.shim
                }
            }
        },
        /**
         * YUIDOC
         */
        yuidoc: {
            'default': {
                name: '<%= application.name %>',
                description: '<%= application.description %>',
                version: '<%= application.version %>',
                options: {
                    paths: ['www/application', 'www/framework'],
                    themedir: 'yuidoc',
                    outdir: 'build/docs'
                }
            }
        }
    });

    grunt.registerTask('clean-build', [
        'clean:build-docs',
        'clean:build-web'
    ]);

    grunt.registerTask('clean-dev', [
        'clean:nodemodules'
    ]);

    grunt.registerTask('build-docs', [
        'clean:build-docs',
        'yuidoc:default'
    ]);

    grunt.registerTask('build-web', [
        'validate',
        'clean:build-web',
        'requirejs:build-web',
        'replace:build-web',
        'htmlmin:build-web'
    ]);

    grunt.registerTask('validate', [
        //'csslint:all',
        'jshint:all'
    ]);

    grunt.registerTask('wipe', [
        'clean-build',
        'clean-dev'
    ]);

};
