gulp = require 'gulp'
uglify = require 'gulp-uglify'
config = require './gulp_config.json'
coffee = require 'gulp-coffee'
gutil = require 'gulp-util'
rename = require 'gulp-rename'
fs = require 'fs'
path = require 'path'
_ = require 'underscore'

coffee_to_js = (asset)->
  gulp.src(asset.src)
      .pipe(coffee({bare: true}).on('error',gutil.log))
      .pipe(uglify())
      .pipe(rename({extname: '.min.js'}))
      .pipe(gulp.dest(asset.dest))

js_uglify = (asset) ->
  gulp.src(asset.src)
      .pipe(uglify())
      .pipe(rename({extname: '.min.js'}))
      .pipe(gulp.dest(asset.dest))

gulp.task 'development', ->
  gulp.src(config.coffee.src)
      .pipe(coffee({bare: true}).on('error',gutil.log))
      .pipe(gulp.dest("_assets/javascript"))

gulp.task 'default', ->
  coffee_to_js(config.coffee)
  js_uglify(config.js)
