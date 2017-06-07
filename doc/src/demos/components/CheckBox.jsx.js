define(function (require) {

    var Creater = require('../Main.jsx');
    var CheckBox = require('fcui2/CheckBox.jsx');

    var items = [
        {
            title: 'Normal CheckBox',
            props: {}
        },
        {
            title: 'CheckBox with Value',
            props: {value: 'my checkbox'}
        },
        {
            title: 'CheckBox with ClassName',
            props: {label: '请选择：', className: 'marginLeft100 border2'}
        },
        {
            title: 'CheckBox with Label',
            props: {label: '请选择：'}
        },
        {
            title: 'CheckBox with Indeterminate',
            props: {indeterminate: true, label: '半选择状态复选框'}
        },
        {
            title: 'CheckBox with right Label',
            props: {label: '这是啥', labelPosition: 'right'}
        },
        {
            title: 'Disabled CheckBox',
            props: {disabled: true, label: '请选择'}
        },
        {
            title: 'Readonly CheckBox',
            props: {checked: true, label: '请选择', disabled: true}
        }
    ];

    return Creater(CheckBox, items, 'onChange');
});
