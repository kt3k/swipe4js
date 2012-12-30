# swipe4.js
# https://github.com/kt3k/swipe4js
#
# author: kt3k (Yosiya Hinosawa)
# license: MIT license

module.exports = (grunt) ->

  grunt.initConfig
    jshint:
      swipe4js:
        src: ['swipe4.js']
        options:
          jshintrc: ".jshintrc"

    qunit:
      all: ['test/index.html']

    uglify:
      swipe4js:
        files:
          'swipe4.min.js': ['swipe4.js']
      swipe4fulljs:
        files:
          'swipe4.full.min.js': ['mainloopjs/mainloop.js', 'swipe4.js']


  grunt.loadNpmTasks 'grunt-contrib-jshint'
  grunt.loadNpmTasks 'grunt-contrib-connect'
  grunt.loadNpmTasks 'grunt-contrib-qunit'
  grunt.loadNpmTasks 'grunt-contrib-uglify'

  grunt.registerTask 'default', ['jshint', 'qunit', 'uglify']
