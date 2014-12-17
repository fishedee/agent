'use strict';

module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-hashres');

    grunt.initConfig({
        dir: {
            dist: '../public'
        },
        clean: {
            options: {
                force: true
            },
            all: ['<%=dir.dist%>/**']
        },
        copy: {
            all: {
                src: ['**','!libs/**', '!node_modules/**', '!build/**', '!Gruntfile.js', '!package.json'],
                dest: '<%=dir.dist%>/'
            }
        },
        uglify: {
            options: {
                preserveComments: 'some',
				report: 'min',
				mangle: true
            },
            all: {
                files: [
                    {
                        expand: true,
                        cwd: '<%=dir.dist%>/',
                        src: [
							'./**/*.js'
                            //'./assets/js/*.js',
                            //'./h5/*.js',
                            //'./mobile/*.js',
                        ],
                        dest: '<%=dir.dist%>/'
                    }
                ]
            }
        },
        cssmin: {
            options: {
                keepSpecialComments: 0
            },
            all: {
                files: [
                    {
                        expand: true,
                        cwd: '<%=dir.dist%>/',
                        src: [
							'./**/*.css'
                            //'./assets/css/*.css',
                            //'./h5/*.css',
                            //'./mobile/*.css',
                        ],
                        dest: '<%=dir.dist%>/'
                    }
                ]
            }
        },
        hashres: {
            options: {
                fileNameFormat: '${name}.${ext}?${hash}',
                renameFiles: false
            },
            all: {
                src: ['./**/*.js', './**/*.css'],
                dest: '<%=dir.dist%>/**/*.html'
            }
        }
    });

    grunt.registerTask('default', ['clean:all', 'copy:all', 'uglify:all', 'cssmin:all', 'hashres:all']);
};
