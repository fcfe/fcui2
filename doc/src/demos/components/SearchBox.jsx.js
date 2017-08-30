define(function (require) {

    var Creater = require('../Main.jsx');
    var SearchBox = require('fcui2/SearchBox.jsx');

    var items = [
        {
            title: 'Normal SearchBox',
            props: {
                showClearButton: true
            }
        },
        {
            title: 'SearchBox with ClassName',
            props: {className: 'marginLeft100'}
        },
        {
            title: 'SearchBox width Button',
            props: {
                mode: 'withButton'
            }
        },
        {
            title: 'Readonly SearchBox',
            props: {value: 'readonly'}
        },
        {
            title: 'Disabled SearchBox',
            props: {disabled: true}
        },
        {
            title: 'SearchBox with Placeholder',
            props: {placeholder: 'please input'}
        },
        {
            title: 'SearchBox with Width',
            props: {width: 500}
        }
    ];

    return Creater(SearchBox, items, ['onChange','onClick']);
});
