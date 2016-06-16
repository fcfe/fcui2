define(function (require) {

    var Creater = require('../main.jsx');
    var AlphabetRegion = require('fcui/AlphabetRegion.jsx');

    var items = [
        {
            title: 'Normal AlphabetRegion',
            props: {}
        }
    ];

    return Creater(AlphabetRegion, items, 'onClick');
});
