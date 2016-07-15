define(function (require) {

    var Creater = require('../Main.jsx');
    var TextBox = require('fcui/TextBox.jsx');

    var items = [
        {
            title: 'Normal TextBox',
            props: {}
        },
        {
            title: 'TextBox with ClassName',
            props: {className: 'marginLeft100 border2'}
        },
        {
            title: 'Readonly TextBox',
            props: {value: 'readonly'}
        },
        {
            title: 'Disabled TextBox',
            props: {disabled: true}
        },
        {
            title: 'Disabled TextBox with value',
            props: {disabled: true, value: 'value'}
        },
        {
            title: 'TextBox with Placeholder',
            props: {placeholder: 'please input'}
        },
        {
            title: 'TextBox with Placeholder and value',
            props: {value: 1, placeholder: 'please input'}
        },
        {
            title: 'TextBox with Width',
            props: {width: 500}
        }
    ];

    return Creater(TextBox, items, 'onChange');

});
