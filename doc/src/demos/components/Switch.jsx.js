define(function (require) {

    var Creater = require('../Main.jsx');
    var Switch = require('fcui2/Switch.jsx');

    var items = [
        {
            title: 'Normal Switch',
            props: {}
        },
        {
            title: 'Switch with Value',
            props: {value: 'my checkbox'}
        },
        {
            title: 'Switch with ClassName',
            props: {className: 'marginLeft100 border2'}
        },
        {
            title: 'Disabled Switch',
            props: {disabled: true, label: '请选择'}
        },
        {
            title: 'Readonly Switch',
            props: {checked: true, label: '请选择'}
        }
    ];

    return Creater(Switch, items, 'onChange');
});
