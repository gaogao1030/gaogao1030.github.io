gulp = require 'gulp'
uglify = require 'gulp-uglify'
config = require './gulp_config.json'
coffee = require 'gulp-coffee'
gutil = require 'gulp-util'
rename = require 'gulp-rename'
fs = require 'fs'
path = require 'path'
_ = require 'underscore'

coffee_to_js = (assets)->
  _.each(assets,(asset) ->
    gulp.src(asset.src)
        .pipe(coffee({bare: true}).on('error',gutil.log))
        .pipe(uglify())
        .pipe(rename({extname: '.min.js'}))
        .pipe(gulp.dest("assets/javascript/"))
  )

js_uglify = (assets) ->
  _.each(assets,(asset) ->
    gulp.src(asset.src)
        .pipe(uglify())
        .pipe(rename({extname: '.min.js'}))
        .pipe(gulp.dest("assets/javascript/"))
  )

gulp.task 'default', ->
  coffee_to_js(config.coffee)
  js_uglify(config.js)
