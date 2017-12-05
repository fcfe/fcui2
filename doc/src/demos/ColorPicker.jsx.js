define(function (require) {

    var Creater = require('./Main.jsx');
    var ColorPicker = require('fcui2/ColorPicker.jsx');

    var items = [
        {
            title: 'Normal ColorPicker',
            props: {}
        },
        {
            title: 'Readonly ColorPicker',
            props: {value: '{"css": "#8C8C00"}'}
        }
    ];

    return Creater(ColorPicker, items, 'onChange');
});
