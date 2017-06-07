define(function (require) {


    var Creater = require('../Main.jsx');
    var Calendar = require('fcui2/Calendar.jsx');
    var timer = new Date();

    var items = [
        {
            title: 'Normal Calendar',
            props: {}
        },
        {
            title: 'Calendar with ClassName',
            props: {className: 'border2'}
        },
        {
            title: 'Readonly Calendar',
            props: {value: timer.getFullYear() + '-' + (timer.getMonth() + 1) + '-' + timer.getDate()}
        },
        {
            title: 'Calendar with Min',
            props: {min: timer.getFullYear() + '-' + (timer.getMonth() + 1) + '-' + (timer.getDate() - 5)}
        },
        {
            title: 'Calendar with Max',
            props: {max: timer.getFullYear() + '-' + (timer.getMonth() + 1) + '-' + (timer.getDate() + 5)}
        },
        {
            title: 'Disabled Calendar',
            props: {disabled: true}
        }
    ];

    return Creater(Calendar, items, 'onChange');
});
