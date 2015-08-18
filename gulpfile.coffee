gulp = require 'gulp'
watch = require 'gulp-watch'
uglify = require 'gulp-uglify'
config = require './gulp_config.json'
coffee = require 'gulp-coffee'
gutil = require 'gulp-util'
rename = require 'gulp-rename'

fs = require 'fs'
path = require 'path'
_ = require 'underscore'

gulp.task 'compressed', ->
    dest = "assets/javascript"
    gulp.src(config.coffee.src)
      .pipe(coffee({bare: true}).on('error',gutil.log))
      .pipe(uglify())
      .pipe(rename({extname: '.min.js'}))
      .pipe(gulp.dest(dest))
    gulp.src(config.js.src)
      .pipe(uglify())
      .pipe(rename({extname: '.min.js'}))
      .pipe(gulp.dest(dest))

gulp.task 'watch',->
  dest = "_site/javascript"
  gulp.src(config.coffee.src)
    .pipe(watch(config.coffee.src))
    .pipe(coffee({bare: true}).on('error',gutil.log))
    .pipe(gulp.dest(dest))
  gulp.src(config.js.src)
    .pipe(watch(config.js.src))
    .pipe(gulp.dest(dest))

gulp.task 'default', ->
  console.log "hellow"
