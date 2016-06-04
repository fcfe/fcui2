
var fs = require('fs');
var srcDir = './src';
var outDir = './docs/dataset';
var yuiOpts = {
    paths: [srcDir],
    outdir: outDir
};
var YUI = require('yuidocjs');
(new YUI.YUIDoc(yuiOpts)).run();

setTimeout(function () {
    var data = fs.readFileSync(outDir + '/data.json').toString();
    fs.writeFileSync(outDir + '/dataset.js', 'var docsDataSet=' + data);
    fs.unlinkSync(outDir + '/data.json');
    console.log('FCUI2 docs parsed!')
}, 1000);
