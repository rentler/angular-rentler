'use strict';

module.exports = function (config) {
  config.set({
    basePath: './',
    files: [
      'bower_components/lodash/lodash.js',
      'bower_components/angular/angular.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'src/**/*.js'
    ],
    colors: true,
    frameworks: ['jasmine'],
    browsers: ['PhantomJS'],
    plugins: [
	    'karma-phantomjs-launcher',
      'karma-jasmine'
    ]
  });
};