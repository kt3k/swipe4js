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

  grunt.loadNpmTasks 'grunt-contrib-uglify'

  grunt.registerTask 'default', ['uglify']
