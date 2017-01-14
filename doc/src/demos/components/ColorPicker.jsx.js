define(function (require) {

    var Creater = require('../Main.jsx');
    var ColorPicker = require('fcui/ColorPicker.jsx');

    var items = [
        {
            title: 'Normal ColorPicker',
            props: {}
        },
        {
            title: 'Readonly ColorPicker',
            props: {value: '{"css": "#FFFF00"}'}
        }
    ];

    return Creater(ColorPicker, items, 'onChange');
});
