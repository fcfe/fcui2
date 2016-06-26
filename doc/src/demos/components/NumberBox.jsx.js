define(function (require) {

    var Creater = require('../Main.jsx');
    var NumberBox = require('fcui/NumberBox.jsx');

    var items = [
        {
            title: 'Normal NumberBox',
            props: {}
        },
        {
            title: 'NumberBox without SpinButton',
            props: {showSpinButton: false}
        },
        {
            title: 'Readonly NumberBox',
            props: {value: 235}
        },
        {
            title: 'NumberBox can input Integer only',
            props: {type: 'int'}
        },
        {
            title: 'NumberBox with Max',
            props: {max: 10}
        },
        {
            title: 'NumberBox with PlaceHolder',
            props: {placeholder: '请输入数字'}
        },
        {
            title: 'NumberBox with Min, and an incorrect Value',
            props: {min: 10, value: 1}
        },
        {
            title: 'NumberBox with Step',
            props: {min: -100, max: 100, step: 10}
        },
        {
            title: 'NumberBox with Fixed',
            props: {fixed: 3, width: 100}
        },
        {
            title: 'NumberBox with ClassName',
            props: {className: 'marginLeft100'}
        },
        {
            title: 'Disabled NumberBox',
            props: {disabled: true}
        },
        {
            title: 'NumberBox with Width',
            props: {width: 500}
        }
    ];

    return Creater(NumberBox, items, 'onChange');
});
