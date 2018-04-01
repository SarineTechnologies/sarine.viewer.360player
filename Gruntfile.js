'use strict';
module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt)
    var target = grunt.option('target') || "";
    var config = {};
	config.dist = decideDist();
    config.coreFiles = getCoreFiles();

    grunt.initConfig({
        config: grunt.file.readJSON(target + "package.json"),
        clean: {
            build: [target + "lib/", target + "dist/", target + "build/"],
            postbuild: [target + "build/"]
        },
        concat: {
            coffeebundle: {
                src: [config.coreFiles , target + 'src/main.js'],
                dest: target + 'web/dist/<%= config.name %>.bundle.js',
            }
        },
        uglify: {
            options: {
                preserveComments: 'some',
                banner: '/*\n<%= config.name %> - v<%= config.version %> - ' +
                        ' <%= grunt.template.today("dddd, mmmm dS, yyyy, h:MM:ss TT") %> ' + '\n ' + grunt.file.read("copyright.txt") + '\n*/\n'
            },
            bundle: {
                src: target + 'web/dist/<%= config.name %>.bundle.js',
                dest: config.dist.root + '/<%= config.name %>.bundle.min.js'
            }
        },
        coffee: {
            build: {
                option: {
                    join: true,
                    extDot: 'last'
                },
                dest: config.dist.root + '/<%= config.name %>.js',
                src: [target + 'src/main.js']

            },
            bundle: {
                option: {
                    join: true,
                    extDot: 'last'
                },
                dest: config.dist.root + '/<%= config.name %>.bundle.js',
                src: [target + 'web/dist/<%= config.name %>.bundle']

            }
        },
        copy: {
            bundle: {
                dest: config.dist.root + '/<%= config.name %>.config',
                src: [target + '<%= config.name %>.config']
            }
        },
         watch: {
                options: {
                    interrupt: true
                },
                scripts: {
                    files: [target + 'coffee/<%= config.name %>.coffee'],
                    tasks: ['build'],
                    options: {
                        spawn: false,
                    }
                }
            }

    })
    grunt.registerTask('build', [
        'clean:build',
        'concat:coffeebundle',
        //'coffee:bundle',
        //'coffee:build',
        'uglify',
        'clean:postbuild',
        'copyVersion',
        'copy:bundle'
    ]);

    grunt.registerTask('dev', ['build', 'watch']);

       grunt.registerTask('copyVersion' , 'copy version from package.json to sarine.viewer.clarity.config' , function (){
        var packageFile = grunt.file.readJSON(target + 'package.json');
        var configFileName = target + packageFile.name + '.config';
        var copyFile = null;
        if (grunt.file.exists(configFileName))
            copyFile = grunt.file.readJSON(configFileName);
        
        if (copyFile == null)
            copyFile = {};

        copyFile.version = packageFile.version;
        grunt.file.write(configFileName , JSON.stringify(copyFile));
    });


    function decideDist()
    {
        if(process.env.buildFor == 'deploy')
        {
            grunt.log.writeln("dist is github folder");

            return {
                root: 'app/dist/'
            }
        }
        else
        {
            grunt.log.writeln("dist is local");

            return {
                root: '../../../dist/content/viewers/atomic/v1/js/'
            }
        }
    }

    function getCoreFiles()
    {
        var core;

        if(process.env.buildFor == 'deploy')
        {
            core = 
            [
                'node_modules/sarine.viewer/coffee/sarine.viewer.coffee'
            ]

            grunt.log.writeln("taking core files from node_modules");
        }
        else
        {
            core = 
            [
                '../sarine.viewer/coffee/sarine.viewer.coffee'
            ]

            grunt.log.writeln("taking core files from parent folder");
        }

        return core;
    }

};
