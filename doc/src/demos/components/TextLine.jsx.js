define(function (require) {

    var Creater = require('../Main.jsx');
    var TextLine = require('fcui/TextLine.jsx');

    var items = [
        {
            title: 'Normal TextLine',
            props: {placeholder: 'please input'}
        },
        {
            title: 'Readonly TextLine',
            props: {value: '百度\n腾讯\n阿里\n腾讯\n阿里'}
        }
    ];

    return Creater(TextLine, items, 'onChange');
});

