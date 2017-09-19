define(function (require) {

    var Creater = require('./Main.jsx');
    var TextArea = require('fcui2/TextArea.jsx');

    var items = [
        {
            title: 'Normal TextArea',
            props: {}
        },
        {
            title: 'TextArea with ClassName',
            props: {className: 'marginLeft100'}
        },
        {
            title: 'Readonly TextArea',
            props: {value: 'readonly'}
        },
        {
            title: 'TextArea with Placeholder',
            props: {placeholder: 'please input'}
        },
        {
            title: 'Disabled TextArea',
            props: {disabled: true, placeholder: 'please input'}
        },
        {
            title: 'TextArea with Size',
            props: {width: 500, height: 300}
        }
    ];

    return Creater(TextArea, items, 'onChange');
});
