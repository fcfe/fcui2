

const path = require('path');
const babel = require('babel-core');
const fs = require('fs');


const OUTPUT = path.resolve(__dirname, './dist');
const INPUT = path.resolve(__dirname, './src');
const BABEL_OPTION = {
    compact: false,
    ast: false,
    presets: ['react'],
    sourceMaps: true,
    minified: false,
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
};


empty(OUTPUT);
fs.mkdirSync(OUTPUT);
compile(INPUT);
compileIndex();


// 编译入口文件
function compileIndex() {
    let index = fs.readFileSync(path.resolve(__dirname, './index.js'), 'utf8');
    index = index.replace(/.\/src\//g, '.\/');
    fs.writeFileSync(OUTPUT + '/index.js', index);
}


// 编译输出js
function compile(dir) {
    if(fs.existsSync(dir)) {
        const files = fs.readdirSync(dir);
        files.map(function (file) {
            const fileRealPath = dir + '/' + file;
            const fileOutPath = OUTPUT + fileRealPath.replace(INPUT, '');
            if (file.match(/.js$/)) {
                console.log(fileRealPath + '=>' + fileOutPath);
                const result = babel.transformFileSync(fileRealPath, BABEL_OPTION);
                fs.writeFileSync(fileOutPath, result.code);
            }
            else if (fs.statSync(fileRealPath).isDirectory()) {
                fs.mkdirSync(fileOutPath);
                compile(fileRealPath);
            }
        });
    }
}


// 清空目录
function empty(dir) {
    if(fs.existsSync(dir)) {
        const files = fs.readdirSync(dir);
        files.map(function (file) {
            const curPath = dir + '/' + file;
            if(fs.statSync(curPath).isDirectory()) {
                empty(curPath);
            }
            else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(dir);
    }
}
