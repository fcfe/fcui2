define(function (require) {

    var Creater = require('./Main.jsx');
    var ColorGrid = require('fcui2/ColorGrid.jsx');

    var items = [
        {
            title: 'Normal ColorGrid',
            props: {}
        },
        {
            title: 'ColorGrid with Value',
            props: {value: '{"hex": "#34C2E8"}'}
        },
        {
            title: 'Disabled ColorGrid',
            props: {disabled: true}
        }
    ];

    return Creater(ColorGrid, items, 'onChange');
});