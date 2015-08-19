'uset strict'
gulp = require 'gulp'
watch = require 'gulp-watch'
uglify = require 'gulp-uglify'
config = require './gulp_config.json'
coffee = require 'gulp-coffee'
gutil = require 'gulp-util'
rename = require 'gulp-rename'
compass = require 'gulp-compass'
minifycss = require 'gulp-minify-css'
sass = require 'gulp-sass'
fs = require 'fs'
path = require 'path'
_ = require 'underscore'


js_dest = "_site/javascript"
css_dest = "_site/stylesheets"
css_source = "_assets/stylesheets"

gulp.task 'compressed', ->
    gulp.src(config.coffee.src)
      .pipe(coffee({bare: true}).on('error',gutil.log))
      .pipe(uglify())
      .pipe(rename({extname: '.min.js'}))
      .pipe(gulp.dest(config.coffee.dest))
    gulp.src(config.js.src)
      .pipe(uglify())
      .pipe(rename({extname: '.min.js'}))
      .pipe(gulp.dest(config.js.dest))
    gulp.src(config.scss.src)
      .pipe(compass({
        sass: css_source
      }))
      .pipe(minifycss())
      .pipe(rename({extname: '.min.css'}))
      .pipe(gulp.dest(config.scss.dest))

gulp.task 'uncompressed', ->
    gulp.src(config.coffee.src)
      .pipe(coffee({bare: true}).on('error',gutil.log))
      .pipe(gulp.dest(js_dest))
    gulp.src(config.js.src)
      .pipe(gulp.dest(js_dest))
    gulp.src(config.scss.src)
      .pipe(compass({
        css: css_dest
        sass: css_source
      }))

gulp.task 'watch',->
  watch(config.coffee.src).on 'change', (path)->
    dest = path.split("/").slice(0,-1).join("/").replace("_assets","_site")
    gulp.src(path)
    .pipe(coffee({bare: true}).on('error',gutil.log))
    .pipe(gulp.dest(dest))
    console.log path + ' was changed'
  watch(config.js.src).on 'change', (path)->
    dest = path.split("/").slice(0,-1).join("/").replace("_assets","_site")
    gulp.src(path)
    .pipe(gulp.dest(dest))
    console.log path + ' was changed'
  watch(config.scss.src).on 'change',(path) ->
    gulp.src(path)
      .pipe(compass({
        css: css_dest
        sass: css_source
      }))


gulp.task 'dev',['uncompressed','watch']

gulp.task 'default', ['compressed']

