var cwd = __dirname;
var path = require( 'path' );

/**
 * 输入目录
 *
 * @type {string}
 */
exports.input = path.resolve(cwd);

/**
 * 输出目录
 *
 * @type {string}
 */
exports.output = path.resolve(cwd, 'build-doc');

/**
 * 排除文件pattern列表
 *
 * @type {Array}
 */
exports.exclude = [
    'Desktop.ini',
    'Thumbs.db',
    '.DS_Store',
    '*.tmp',
    '*.bak',
    '*.swp',
    '.eslintrc.json',
    'node_modules',
    'build',
    'test',
    '.gitignore',
    '.gitreview',
    '.travis.yml',
    'edp-*.js',
    'FcDocsBuilder.js',
    'FcBabelProcessor.js',
    'karma.conf.js',
    'LICENSE',
    '*.json',
    '*.conf',
    '*.md',
    '*.md5',
    '.coveralls.yml',
    'karma-test-main.js'
];


/**
 * 获取构建processors的方法
 *
 * @return {Array}
 */
exports.getProcessors = function () {
    var FcBabelProcessor = require('./FcBabelProcessor');

    return [
        new FcBabelProcessor(),
        new LessCompiler({
            files: [
                'src/css/main.less',
                'src/css/icon/fc-icon.less',
                'doc/css/main.less'
            ]
        }),
        new CssCompressor(),
        new ModuleCompiler({
            configFile: './edp-build-doc.conf'
        }),
        // new JsCompressor({
        //     files: [
        //         'doc/src/main.js'
        //     ]
        // }),
        new OutputCleaner({
            files: [
                '*.js',
                '*.less',
                '!doc/src/main.js',
                '!dep/require.min.js',
                '!src/css/main.less',
                '!src/css/icon/fc-icon.less',
                '!doc/css/main.less'
            ]
        })
    ];
};


/**
 * builder主模块注入processor构造器的方法
 *
 * @param {Object} processors
 */
exports.injectProcessor = function ( processors ) {
    for ( var key in processors ) {
        global[ key ] = processors[ key ];
    }
};
