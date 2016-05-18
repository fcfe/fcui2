var allTestFiles = [];
var TEST_REGEXP = /(spec|test|spec\.es6)\.js$/i;

// Get a list of all the test files to include
Object.keys(window.__karma__.files).forEach(function(file) {
  if (TEST_REGEXP.test(file)) {
    // Normalize paths to RequireJS module names.
    // If you require sub-dependencies of test files to be loaded as-is (requiring file extension)
    // then do not normalize the paths
    var normalizedTestModule = file.replace(/^\/base\/|\.js$/g, '');
    allTestFiles.push(normalizedTestModule);
  }
});

require.config({
  // Karma serves files under /base, which is the basePath from your config file
  baseUrl: '/base/output',

  // dynamically load all test files
  deps: allTestFiles,

  // we have to kickoff jasmine, as it is asynchronous
  callback: window.__karma__.start,

  packages: [
    {
      name: 'test',
      location: '../test'
    }
  ],

  'paths': {
    'react': '../dep/react-with-addons',
    'react-dom': '../dep/react-dom',
    'underscore': '../dep/underscore/1.8.5/src/underscore'
  }
});
