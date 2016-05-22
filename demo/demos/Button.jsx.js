define(function (require) {

    var Button = require('fcui/Button.jsx');
    var Creater = require('../ReactClassCreater.jsx');

    var items = [
        {
            title: 'Normal Button',
            props: {label: '确定', value: 'enter button'}
        },
        {
            title: 'Button with Title',
            props: {label: 'Button', value: 'title button', title: 'Button With Title'}
        },
        {
            title: 'Button with ClassName',
            props: {label: 'Button', value: 'class button', className: 'marginLeft100 border2'}
        },
        {
            title: 'Submit Button',
            props: {label: 'Submit', type:'submit', name: 'submit1', skin: 'important', value: 'submit button'}
        },
        {
            title: 'Active Button',
            props: {label: 'Active', skin: 'active', value: 'active button'}
        },
        {
            title: 'Disabled Button',
            props: {label: 'Button Disabled', disabled: true, value: 'disabled button'}
        },
        {
            title: 'Button with Icon and Skin',
            props: {label: 'Find', skin:'important', icon: 'font-icon-enlarge', value: 'button width icon'}
        },
        {
            title: 'Button with Style',
            props: {label: 'Width', style: {width: 300}, value: 'button with minWidth'}
        }
    ];

    return Creater(Button, items, 'onClick');

});
