// Test configuration for edp-test
// Generated on Fri May 13 2016 15:20:48 GMT+0800 (CST)
module.exports = {

    node: false,

    // base path, that will be used to resolve files and exclude
    basePath: '../',

    // module loader require config
    requireConfig: {
        baseUrl: '../src',
        paths: {
            'react': '../dep/react-with-addons',
            'react-dom': '../dep/react-dom'
        },
        packages: [
            {
                name: 'underscore',
                location: '../dep/underscore/1.8.5/src',
                main: 'underscore'
            }
        ]
    },

    // show qrcode for mobile development
    qrcode: false,

    // frameworks to use
    frameworks: ['jasmine2.3.4', 'esl'],


    // list of files / patterns to load in the browser
    files: [
        'test/**/*Spec.js',
        'test/**/*Spec.es6.js'
    ],

    // optionally, configure the reporter
    coverageReporter: {
        // text-summary | text | html | json | teamcity | cobertura | lcov
        // lcovonly | none | teamcity
        type : 'text|html',
        dir : 'test/coverage/',
        exclude: []
    },

    // web server port
    port: 8120,


    // enable / disable watching file and executing tests whenever any file changes
    watch: true,


    // Start these browsers, currently available:
    // - Chrome
    // - Firefox
    // - Opera
    // - Safari
    // - PhantomJS
    // - IE (only Windows)
    browsers: [
        // 'Chrome',
        // 'Firefox',
        // 'Safari',
        'Chrome'
    ],


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false,


    // Custom HTML templates
    // context | debug | runner
    templates: {
        // context: 'context.html'
    }
};
