'use strict';

const gulp = require('gulp');
const mocha = require('gulp-mocha');

gulp.task('copy-to-tests', () => {
  return gulp.src(['./index.js', './package.json'])
      .pipe(gulp.dest('./test/happy/node_modules/uniquire'));
})

gulp.task('test:happy', ['copy-to-tests'], () => {

  return gulp.src(['./test/happy/*-spec.js'], {read: false})
      .pipe(mocha());

});

gulp.task('test', ['test:happy']);

