define(function (require) {

    var Creater = require('../Main.jsx');
    var Tab = require('fcui2/Tab.jsx');

    var items = [
        {
            title: 'Tab Level-1',
            props: {
                skin: 'level-1',
                datasource: [
                    {label: 'option1', value: 'option1'},
                    {label: 'option2', value: 'option2'},
                    {label: 'option3', value: 'option3'},
                    {label: 'option4', value: 'option4'},
                    {label: 'option5', value: 'option5'}
                ]
            }
        },
        {
            title: 'Tab Level-2',
            props: {
                datasource: [
                    {label: 'option1', value: 'option1'},
                    {label: 'option2', value: 'option2'},
                    {label: 'option3', value: 'option3'},
                    {label: 'option4', value: 'option4'},
                    {label: 'option5', value: 'option5'}
                ]
            }
        },
        {
            title: 'Tab Level-3',
            props: {
                skin: 'level-3',
                datasource: [
                    {label: 'option1', value: 'option1'},
                    {label: 'option2', value: 'option2'},
                    {label: 'option3', value: 'option3'},
                    {label: 'option4', value: 'option4'},
                    {label: 'option5', value: 'option5'}
                ]
            }
        },
        {
            title: 'Disabled Tab',
            props: {
                disabled: true,
                value: 'option1',
                datasource: [
                    {label: 'option1', value: 'option1'},
                    {label: 'option2', value: 'option2'},
                    {label: 'option3', value: 'option3'},
                    {label: 'option4', value: 'option4'},
                    {label: 'option5', value: 'option5'}
                ]
            }
        },
        {
            title: 'Tab with Disabled Item',
            props: {
                datasource: [
                    {label: 'option1', value: 'option1'},
                    {label: 'option2', value: 'option2', disabled: true},
                    {label: 'option3', value: 'option3'},
                    {label: 'option4', value: 'option4'},
                    {label: 'option5', value: 'option5'}
                ]
            }
        },
        {
            title: 'Readonly Tab',
            props: {
                value: 'option3',
                datasource: [
                    {label: 'option1', value: 'option1'},
                    {label: 'option2', value: 'option2'},
                    {label: 'option3', value: 'option3'},
                    {label: 'option4', value: 'option4'},
                    {label: 'option5', value: 'option5'}
                ]
            }
        }
    ];

    return Creater(Tab, items, 'onChange');
});
