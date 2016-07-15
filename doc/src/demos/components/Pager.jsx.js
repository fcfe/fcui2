define(function (require) {

    var Creater = require('../Main.jsx');
    var Pager = require('fcui/Pager.jsx');

    var items = [
        {
            title: 'Normal Pager',
            props: {}
        },
        {
            title: 'Pager with ClassName',
            props: {className: 'floatRight'}
        },
        {
            title: 'Readonly Pager',
            props: {
                value: '4',
                skin: 'simple'
            }
        },
        {
            title: 'Disabled Pager',
            props: {disabled: true}
        },
        {
            title: 'Pager with Setting',
            props: {min: 10, max: 30, threshold: 2}
        }
    ];

    return Creater(Pager, items, 'onChange');
});
