# swipe4.js
# https://github.com/kt3k/swipe4js
#
# author: kt3k (Yosiya Hinosawa)
# license: MIT license

module.exports = (grunt) ->

  grunt.initConfig
    uglify:
      swipe4js:
        files:
          'swipe4.min.js': ['swipe4.js']
      swipe4fulljs:
        files:
          'swipe4.full.min.js': ['mainloopjs/mainloop.js', 'swipe4.js']

    jshint:
      swipe4js:
        src: ['swipe4.js']
        options:
          expr: true
          boss: true
          strict: true
          eqnull: true
          white: true
          maxlen: 80
          undef: true
          unused: true

  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-jshint'

  grunt.registerTask 'default', ['jshint', 'uglify']
