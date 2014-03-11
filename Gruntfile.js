module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            js: {
                src: [
                    // Library & Plugins
                    'bower_components/jquery/dist/jquery.js',
                    'bower_components/jquery-minicolors/jquery.minicolors.js',
                    'bower_components/jquery.lazyload/jquery.lazyload.js',
                    'bower_components/jquery-cookie/jquery.cookie.js',
                    'bower_components/zeroclipboard/ZeroClipboard.js',
                    // User scripts
                    'theme/static/js/main.js',
            ],
                dest: 'theme/static/js/all.js',
            },
        },

        uglify: {
            options: {
                mangle: false
            },
            js: {
                files: {
                    'theme/static/js/all.min.js' : ['theme/static/js/all.js']
                }
            }
        },

        sass: {
            dist: {
                options: {
                    style: 'compressed'
                },
                files: {
                    'theme/static/css/styles.css': 'theme/static/css/styles.scss'
                }
            }
        },

        cssmin: {
            combine: {
                files: {
                    'theme/static/css/all.min.css':
                        [
                            'bower_components/jquery-minicolors/jquery.minicolors.css',
                            'bower_components/font-awesome/css/font-awesome.min.css',
                            'theme/static/css/styles.css',
                        ]
                }
            }
        },

        watch: {
            options: {
                livereload: true,
            },
            scripts: {
                files: ['theme/static/js/*.js'],
                tasks: ['concat:js', 'uglify'],
                options: {
                    spawn: false,
                },
            },
            scss: {
                files: ['theme/static/css/*.scss'],
                tasks: ['sass', 'cssmin'],
                options: {
                    spawn: false,
                }
            },
        },

        connect: {
            server: {
                options: {
                    port: 9000,
                    base: 'output',
                    useAvailablePort: true
                }
            }
        },
        shell: {
            listFolders: {
                options: {
                    stdout: true
                },
                command: 'fab regenerate'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-shell');

    grunt.registerTask('default', ['sass', 'concat', 'uglify', 'cssmin']);
    grunt.registerTask('serve', ['connect','watch']);

};
