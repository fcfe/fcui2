define(function (require) {

    var Creater = require('../Main.jsx');
    var Select = require('fcui2/Select.jsx');

    var items = [
        {
            title: 'Normal Select',
            props: {
                placeholder: 'select',
                skin: 'grey',
                datasource: [
                    {label: 'option1', value: 'option1'},
                    {hr: true},
                    {label: 'option2', value: 'option2', disabled: true},
                    {label: 'option3', value: 'option3'},
                    {label: 'option4', value: 'option4'},
                    {label: 'option5', value: 'option5'},
                    {label: 'option4', value: 'option4'},
                    {label: 'option5', value: 'option5'},
                    {label: 'option4', value: 'option4'},
                    {label: 'option5', value: 'option5'},
                    {label: 'option4', value: 'option4'},
                    {label: 'option5', value: 'option5'}
                ]
            }
        },
        {
            title: 'Disabled Select',
            props: {
                placeholder: 'select',
                disabled: true,
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
            title: 'Readonly Select',
            props: {
                placeholder: 'select',
                value: 'option3',
                skin: 'blue',
                width: 200,
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
            title: 'Select without Datasource',
            props: {
                value: 'option3',
                datasource: []
            }
        },
        {
            title: 'Select with width and a very long Option',
            props: {
                placeholder: 'select',
                width: 150,
                datasource: [
                    {label: 'option1option1option1option1option1option1option1option1option1', value: 'option1'},
                    {label: 'option2', value: 'option2', disabled: true},
                    {label: 'option3', value: 'option3'},
                    {label: 'option4', value: 'option4'},
                    {label: 'option5', value: 'option5'}
                ]
            }
        },
        {
            title: 'Select with ClassName',
            props: {
                placeholder: 'select',
                width: 150,
                className: 'floatRight',
                datasource: [
                    {label: 'option1option1option1option1option1option1option1option1option1', value: 'option1'},
                    {label: 'option2', value: 'option2', disabled: true},
                    {label: 'option3', value: 'option3'},
                    {label: 'option4', value: 'option4'},
                    {label: 'option5', value: 'option5'}
                ]
            }
        }
    ];

    return Creater(Select, items, 'onChange');
});
