define(function (require) {

    var Creater = require('./Main.jsx');
    var DropDownCalendar = require('fcui2/DropDownCalendar.jsx');

    var timer = new Date();

    var items = [
        {
            title: 'Normal DropDownCalendar',
            props: {
                skin: 'blue'
            }
        },
        {
            title: 'DropDownCalendar with ClassName',
            props: {
                className: 'marginLeft100',
                skin: 'grey'
            }
        },
        {
            title: 'Readonly DropDownCalendar',
            props: {value: timer.getFullYear() + '-' + (timer.getMonth() + 1) + '-' + timer.getDate()}
        },
        {
            title: 'DropDownCalendar with Min',
            props: {min: timer.getFullYear() + '-' + (timer.getMonth() + 1) + '-' + (timer.getDate() - 5)}
        },
        {
            title: 'DropDownCalendar with Max',
            props: {max: timer.getFullYear() + '-' + (timer.getMonth() + 1) + '-' + (timer.getDate() + 5)}
        },
        {
            title: 'Disabled DropDownCalendar',
            props: {disabled: true, width: 200}
        }
    ];


    return Creater(DropDownCalendar, items, 'onClick');
});
