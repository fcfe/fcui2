define(function (require) {

    var Creater = require('../main.jsx');
    var Radio = require('fcui/Radio.jsx');
    var name = parseInt(10000 * Math.random(), 10) + '-' + parseInt(10000 * Math.random(), 10);

    var items = [
        {
            title: 'Normal Radio',
            props: {name: name, value: 'radio1'}
        },
        {
            title: 'Radio with ClassName',
            props: {name: name, className: 'border2', value: 'radio2'}
        },
        {
            title: 'Radio with Label',
            props: {name: name, label: '请选择：', value: 'radio3'}
        },
        {
            title: 'Radio with right Label',
            props: {name: name, label: '主说要有光，于是有了光', labelPosition: 'right', value: 'radio4'}
        },
        {
            title: 'Disabled Radio',
            props: {name: name, disabled: true, label: '请选择', value: 'radio5'}
        }
    ];

    return Creater(Radio, items, 'onChange');
});
