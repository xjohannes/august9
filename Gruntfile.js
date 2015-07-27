module.exports = function(grunt) {

  require('time-grunt')(grunt);
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: {
      build: ['build'],
      dev: {
        src: ['build/app.js', 'build/<%= pkg.name %>.css', 'build/<%= pkg.name %>.js']
      },
      prod: ['dist']
    },

    browserify: {
      vendor: {
        src: ['node_modules/backbone/backbone.js'],
        dest: 'build/vendor.js',
        options: {
          external: ["jquery", "underscore"]
        }
      },
      app: {
        files: {
          'build/app.js': ['client/src/main.js']
        },
        options: {
          transform: ['hbsfy'],
          external: ['jquery', 'underscore', 'backbone']
        }
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
      'build/<%= pkg.name %>.js': ['build/vendor.js', 'build/app.js']
    },

    copy: {
      dev: {
        files: [{
          src: 'build/<%= pkg.name %>.js',
          dest: 'public/js/<%= pkg.name %>.js'
        }, {
          src: 'build/css/<%= pkg.name %>.css',
          dest: 'public/css/<%= pkg.name %>.css'
        }, {
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
            tasks: ['clean:dev', 'browserify:app', 'concat', 'copy:dev']
          },
          compass: {
            files: ['client/styles/**/*.scss'],
            tasks: ['compass:dev', 'copy:dev']
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
              nodeArgs: ['--debug'],
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


// Register tasks
grunt.registerTask('init:dev', ['clean', 'browserify:vendor']);

grunt.registerTask('build:dev', ['clean:dev', 'browserify:app', 'browserify:test', 
  'jshint:dev',  'compass:dev','concat', 'copy:dev', 'env:dev']);

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
