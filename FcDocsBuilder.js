
var fs = require('fs');
var srcDir = './src';
var outDir = './doc/dataset';
var yuiOpts = {
    paths: [srcDir],
    outdir: outDir
};
var YUI = require('yuidocjs');
(new YUI.YUIDoc(yuiOpts)).run();

setTimeout(function () {
    var data = fs.readFileSync(outDir + '/data.json').toString();
    data = JSON.parse(data);
    for (var key in data) {
        if (!data.hasOwnProperty(key) || key === 'files' || key === 'classitems') continue;
        delete data[key];
    }
    data = JSON.stringify(data);
    fs.writeFileSync(outDir + '/dataset.js', 'define(function(require){return ' + data +';});');
    fs.unlinkSync(outDir + '/data.json');
    console.log('FCUI2 docs parsed!')
}, 1000);
