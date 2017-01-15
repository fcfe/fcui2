define(function (require) {

    var Creater = require('../Main.jsx');
    var DropDownColorPicker = require('fcui/DropDownColorPicker.jsx');

    var items = [
        {
            title: 'Normal DropDownColorPicker',
            props: {}
        },
        {
            title: 'Readonly DropDownColorPicker',
            props: {value: '{"css": "#FF0000"}'}
        },
        {
            title: 'Background Color DropDownColorPicker',
            props: {mode: 'background'}
        }
    ];

    return Creater(DropDownColorPicker, items, 'onChange');
});
