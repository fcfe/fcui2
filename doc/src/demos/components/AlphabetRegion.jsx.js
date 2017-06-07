define(function (require) {

    var Creater = require('../Main.jsx');
    var AlphabetRegion = require('fcui2/AlphabetRegion.jsx');

    var items = [
        {
            title: 'Normal AlphabetRegion',
            props: {}
        },
        {
            title: 'AlphabetRegion with style',
            props: {
                style: {
                    width: 400,
                    height: 300
                }
            }
        },
        {
            title: 'Disabled AlphabetRegion',
            props: {disabled: true}
        }
    ];

    return Creater(AlphabetRegion, items, 'onClick');
});
