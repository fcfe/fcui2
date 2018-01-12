/**
 * @file 适用凤巢的ES6编译的构建处理器，由edp-build默认的babel-processor修改来。
 *  原edp-build的babel-processor不支持babel6的新api，已经修改。
 *  默认选项中增加了es6.js和jsx.js的parse。默认增加了es2015和react的presets。
 * @author zhanglili[otakustay@gmail.com]
 *         leeight[leeight@gmail.com]
 */

var util = require('util');

/**
 * 使用Babel将ES6代码转为ES5代码
 *
 * @constructor
 * @param {Object} options 配置项
 */
function FcBabelProcessor(options) {
    AbstractProcessor.call(this, options);
}
util.inherits(FcBabelProcessor, AbstractProcessor);

FcBabelProcessor.DEFAULT_OPTIONS = {
    name: 'FcBabelProcessor',
    files: ['**/*.es6.js', '**/*.jsx.js'],
    compileOptions: {
        compact: false,
        ast: false,
        presets: ['react'],
        // babel6的es2015 presets会增加一个global的'use strict'，会使得打包的代码执行失败。
        // 因此必须将现在的preset es2015拆开成plugins，分别加载，去掉 'use strict' 的plugin。
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
            // 这个 plugin 会在编译后的代码中增加全局 'use strict'
            // 'babel-plugin-transform-es2015-modules-commonjs',

            // 暂时不建议使用generator
            // ['babel-plugin-transform-regenerator', {
            // async: false, asyncGenerators: false
            // }],

            // es6实验特性，支持object的rest语法 { var ...others } = myObject;
            // 在react代码中有应用
            'transform-object-rest-spread'
        ]
    }
};

/**
 * 构建处理
 *
 * @param {FileInfo} file 文件信息对象
 * @param {ProcessContext} processContext 构建环境对象
 * @param {Function} callback 处理完成回调函数
 */
FcBabelProcessor.prototype.process = function (file, processContext, callback) {
    var code = file.data;
    var options = {};
    for (var p in this.compileOptions) {
        if (this.compileOptions.hasOwnProperty(p)) {
            options[p] = this.compileOptions[p];
        }
    }
    options.filename = file.fullPath;
    var babelResult = require('babel-core').transform(code, options);

    file.setData(babelResult.code);

    callback();
};

module.exports = exports = FcBabelProcessor;
