define(function (require) {

    var Button = require('fcui2/Button.jsx');
    var Creater = require('../Main.jsx');

    var items = [
        {
            title: 'Normal Button',
            props: {label: '确定', value: 'enter button'}
        },
        {
            title: 'Normal Button',
            props: {label: 'oneux4-normal-blue', skin: 'normal-blue'}
        },
        {
            title: 'Normal Button',
            props: {label: 'oneux4-grey-blue', skin: 'grey-blue'}
        },
        {
            title: 'Button with Title',
            props: {label: 'Button', value: 'title button', title: 'Button With Title', skin: 'grey'}
        },
        {
            title: 'Button with ClassName',
            props: {label: 'Button', value: 'class button', className: 'marginLeft100 border2'}
        },
        {
            title: 'Submit Button',
            props: {label: 'Submit', type:'submit', name: 'submit1', skin: 'blue', value: 'submit button'}
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
            title: 'Button with Icon',
            props: {label: 'Find', icon: 'fcui2-icon fcui2-icon-question', skin: 'grey1', value: 'button width icon', width: 80}
        },
        {
            title: 'Button with Style',
            props: {skin: 'important', label: 'Width', icon: 'fcui2-icon fcui2-icon-question', iconLeft: 110, style: {width: 300}, value: 'button with Width'}
        }
    ];

    return Creater(Button, items, 'onClick');

});
