define(function (require) {

    var Creater = require('../main.jsx');
    var Region = require('fcui/Region.jsx');

    var items = [
        {
            title: 'Normal Region',
            props: {}
        },
        {
            title: 'Single Selection Region',
            props: {
                type: 'single'
            }
        },
        {
            title: 'Region with ProvinceRenderer',
            props: {
                provinceRenderer: require('fcui/components/region/StatisticsProvince.jsx')
            }
        },
        {
            title: 'Disabled Region',
            props: {disabled: true}
        },
        {
            title: 'Region with ClassName',
            props: {className: 'border2'}
        },
        {
            title: 'Readonly Region',
            props: {value: '124,16,243,246,249,250,252,253,254,255,256,257,258,261,262,263,266,267,268,760,774,776,901'}
        }
    ];

    return Creater(Region, items, 'onChange');
});
