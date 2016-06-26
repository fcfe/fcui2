// Karma configuration
// Generated on Fri Apr 29 2016 15:57:36 GMT+0800 (CST)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine', 'requirejs'],


    // list of files / patterns to load in the browser
    files: [
      'karma-test-main.js',
      {pattern: 'dep/**/*.js', included: false},
      {pattern: 'build/**/*.es6.js', included: false},
      {pattern: 'build/**/*.jsx.js', included: false},
      {pattern: 'build/**/*.js', included: false},
      {pattern: 'test/spec/**/*Spec.es6.js', included: false},
      {pattern: 'test/spec/**/*Spec.js', included: false}
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'test/**/*Spec.es6.js': ['babel'],
      'build/**/*.es6.js': ['babel'],
      'build/**/*.jsx.js': ['babel'],
      'build/**/*.js': ['coverage']
    },

    // babel preprocessor config
    babelPreprocessor: {
        options: {
          presets: ['react'],
          sourceMap: 'inline',
          plugins: [
              'babel-plugin-transform-es2015-template-literals',
              'babel-plugin-transform-es2015-literals',
              'babel-plugin-transform-es2015-function-name',
              'babel-plugin-transform-es2015-arrow-functions',
              'babel-plugin-transform-es2015-block-scoped-functions',
              'babel-plugin-transform-es2015-classes',
              'babel-plugin-transform-es2015-object-super',
              'babel-plugin-transform-es2015-shorthand-properties',
              'babel-plugin-transform-es2015-computed-properties',
              'babel-plugin-transform-es2015-for-of',
              'babel-plugin-transform-es2015-sticky-regex',
              'babel-plugin-transform-es2015-unicode-regex',
              'babel-plugin-check-es2015-constants',
              'babel-plugin-transform-es2015-spread',
              'babel-plugin-transform-es2015-parameters',
              'babel-plugin-transform-es2015-destructuring',
              'babel-plugin-transform-es2015-block-scoping',
              'babel-plugin-transform-es2015-typeof-symbol',
              'transform-object-rest-spread'
          ]
        }
    },

    coverageReporter: {
      type : 'lcov',
      dir : 'coverage/'
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'coverage'],

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],

    phantomjsLauncher: {
      // Have phantomjs exit if a ResourceError is encountered (useful if karma exits without killing phantom)
      exitOnResourceError: true
    },

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
