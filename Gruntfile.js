module.exports = function(grunt) {

  require('time-grunt')(grunt);
  //require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: {
      build: ['build'],
      dev: {
        src: ['build/app.js', 'build/css/<%= pkg.name %>.css', 'build/<%= pkg.name %>.js']
      },
      prod: ['dist']
    },

    browserify: {
      app: {
        src: ['client/src/main.js'],
        dest: 'public/js/<%= pkg.name %>.js'
      },
      test: {
        files: {
          'build/tests.js': [
          'client/spec/**/*.test.js'
          ]
        },
        options: {
          transform: ['hbsfy'],
          external: ['jquery', 'underscore', 'backbone']
        }
      }
    },

    compass: {
      dev: {
        options: {
          sassDir: 'client/styles/sass',
          cssDir: 'build/css'
        },
        dist: {
          options: {
            sassDir: ['client/styles/sass'],
            cssDir: ['build/css'],
            environment: 'production'
          }
        }
      }
    },
    concat: {
            'public/css/<%= pkg.name %>.css': ['client/styles/reset.css', 'build/css/<%= pkg.name %>.css']
        },

    copy: {
      dev: {
        files: [
        {
          src: 'build/app.js',
          dest: 'public/js/<%= pkg.name %>.js'
        }, 
        
        {
          src: 'build/css/<%= pkg.name %>.css',
          dest: 'public/css/<%= pkg.name %>.css'
        }, 
        
        {
          src: 'client/img/*',
          dest: 'public/img/'
        }]
      },
      prod: {
        files: [{
          src: ['client/img/*'],
          dest: 'dist/img/'
        }]
      }
    },

        // CSS minification.
        cssmin: {
          minify: {
            src: ['build/<%= pkg.name %>.css'],
            dest: 'dist/css/<%= pkg.name %>.css'
          }
        },

        // Javascript minification.
        uglify: {
          compile: {
            options: {
              compress: true,
              verbose: true
            },
            files: [{
              src: 'build/<%= pkg.name %>.js',
              dest: 'dist/js/<%= pkg.name %>.js'
            }]
          }
        },

        // for changes to the front-end code
        watch: {
          scripts: {
            files: ['client/templates/*.hbs', 'client/src/**/*.js'],
            tasks: ['clean:dev', 'browserify:app',  'copy:dev']
          },
          compass: {
            files: ['client/styles/**/*.scss'],
            tasks: ['compass:dev', 'concat']
          },
          test: {
            files: ['build/app.js', 'client/spec/**/*.test.js'],
            tasks: ['browserify:test']
          },
          karma: {
            files: ['build/tests.js'],
            tasks: ['jshint:test', 'karma:watcher:run']
          }
        },

        // for changes to the node code
        nodemon: {
          dev: {
            options: {
              file: 'index.js',
              //nodeArgs: ['--debug'],
              watchedFolders: ['controllers', 'app'],
              env: {
                PORT: '5000'
              }
            }
          }
        },

        // server tests
        simplemocha: {
          options: {
            globals: ['expect', 'sinon'],
            timeout: 3000,
            ignoreLeaks: false,
            ui: 'bdd',
            reporter: 'spec'
          },

          server: {
            src: ['spec/spechelper.js', 'spec/**/*.test.js']
          }
        },

        // shell scripts. Remember to add them at concurrent under. Ex: 'shell:mongo',
        shell: {

        },

        concurrent: {
          dev: {
            tasks: ['nodemon:dev', 'watch:scripts', 'watch:compass', 'watch:test'],
            options: {
              logConcurrentOutput: true
            }
          },
          test: {
            tasks: ['watch:karma'],
            options: {
              logConcurrentOutput: true
            }
          }
        },

        // for front-end tdd
        karma: {
          options: {
            configFile: 'karma.conf.js'
          },
          watcher: {
            background: true,
            singleRun: false
          },
          test: {
            singleRun: true
          }
        },

        jshint: {
          all: ['Gruntfile.js', 'client/src/**/*.js', 'client/spec/**/*.js'],
          dev: ['client/src/**/*.js'],
          test: ['client/spec/**/*.js']
        },
        env : {
          dev : {
            src : ".env"
          }
        }
      });

// Loding tasks. Why isn't this loaded with the load-grunt-tasks module?
grunt.loadNpmTasks('grunt-env');
grunt.loadNpmTasks('grunt-browserify');
grunt.loadNpmTasks('grunt-contrib-jshint');
grunt.loadNpmTasks('grunt-contrib-compass');
grunt.loadNpmTasks('grunt-concurrent');
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-nodemon');
grunt.loadNpmTasks('grunt-contrib-clean');
grunt.loadNpmTasks('grunt-contrib-copy');
grunt.loadNpmTasks('grunt-contrib-concat');



// Register tasks
grunt.registerTask('init:dev', ['clean', 'browserify:vendor']);

grunt.registerTask('build:dev', ['browserify:app', 
  'jshint:dev',  'compass:dev',   'env:dev']); //'clean:dev','browserify:test', 

grunt.registerTask('build:prod', ['clean:prod', 'browserify:vendor', 
  'browserify:app', 'jshint:all',  'compass:prod', 'concat', 'cssmin', 'uglify', 
  'copy:prod']);

grunt.registerTask('heroku', ['init:dev', 'build:dev']);

grunt.registerTask('server', ['build:dev', 'concurrent:dev']);
grunt.registerTask('test:server', ['simplemocha:server']);

grunt.registerTask('test:client', ['karma:test']);
grunt.registerTask('tdd', ['karma:watcher:start', 'concurrent:test']);

grunt.registerTask('test', ['test:server', 'test:client']);

grunt.registerTask('s', ['watch:compass:dev']);


};
