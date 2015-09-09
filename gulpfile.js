'use strict';

var gulp = require('gulp'),
  runSequence = require('run-sequence'),
  del = require('del'),
  KarmaServer = require('karma').Server,
  jshint = require('gulp-jshint'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  sourcemaps = require('gulp-sourcemaps'),
  rename = require('gulp-rename'),
  templateCache = require('gulp-angular-templatecache');
  
var config = {
  tmp: '.tmp',
  src: ['src/**/*.js', '!src/**/*.spec.js'],
  dest: 'dist/',
  templates: 'src/**/*.html',
  fileName: 'angular-rentler.js',
  moduleName: 'rentler'
};

gulp.task('default', ['build']);

gulp.task('clean', function () {
  return del([config.tmp, config.dest]);
});

gulp.task('test', function (done) {
  new KarmaServer({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done)
  .start();
});

gulp.task('lint', function () {
  return gulp.src(config.src)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('templates', function () {
  return gulp.src(config.templates)
    .pipe(templateCache({ module: config.moduleName }))
    .pipe(gulp.dest(config.tmp));
});

gulp.task('scripts', function () {
  var all = config.src.concat(['.tmp/**/*.js']);
  return gulp.src(all)
    .pipe(concat(config.fileName))
    .pipe(gulp.dest(config.dest))
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(config.dest));
});

gulp.task('build', function (done) {
  runSequence(
    'test',
    'lint',
    'clean',
    'templates',
    'scripts',
    done
  );
});