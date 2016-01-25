// 加载
var reactTools = null;
try {
    reactTools =require('react-tools');
    console.log('react-tools');
}
catch (e) {
    var errorMSG = [
        '\t\t==============Load jsx failed==============',
        '\t\tPlease execute the following command:',
        '\t\t\t"npm install react-tools"',
        '\t\tin ' + __dirname,
        '\t\t===========================================',
    ];
    console.log(errorMSG.join('\n'));
    reactTools = {
        transform: function (s) {
            return s;
        }
    };
}

exports.compileHTML = function () {
    return function (context) {
        var code = context.content.toString();
        code = reactTools.transform(code);
        context.content = code;
    };
};