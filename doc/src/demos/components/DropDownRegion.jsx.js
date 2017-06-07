define(function (require) {

    var Creater = require('../Main.jsx');
    var DropDownRegion = require('fcui2/DropDownRegion.jsx');

    var items = [
        {
            title: 'Normal DropDownRegion',
            props: {
                skin: 'blue'
            }
        },
        {
            title: 'Single Selection DropDownRegion',
            props: {
                type: 'single',
                skin: 'grey'
            }
        },
        {
            title: 'Disabled DropDownRegion',
            props: {disabled: true, width: 100}
        },
        {
            title: 'DropDownRegion with ClassName',
            props: {className: 'border2'}
        },
        {
            title: 'Readonly DropDownRegion',
            props: {value: '124,16,243,246,249,250,252,253,254,255,256,257,258,261,262,263,266,267,268,760,774,776,901'}
        }
    ];

    return Creater(DropDownRegion, items, 'onChange');
});
