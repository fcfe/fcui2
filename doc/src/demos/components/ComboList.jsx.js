define(function (require) {

    var Creater = require('../main.jsx');
    var ComboList = require('fcui/ComboList.jsx');

    var items = [
        {
            title: 'Normal ComboList',
            props: {
                label: 'Main Command1',
                value: 'Main Command1',
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
            title: 'Disabled ComboList',
            props: {
                disabled: true,
                value: 'Main Command2',
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
            title: 'ComboList without Datasource',
            props: {
                value: 'Main Command3',
                datasource: []
            }
        },
        {
            title: 'ComboList with a very long Option',
            props: {
                value: 'Main Command4',
                datasource: [
                    {label: 'option1option1option1option1option1option1option1option1option1', value: 'option1'},
                    {label: 'option2', value: 'option2', disabled: true},
                    {label: 'option3', value: 'option3', disabled: true},
                    {label: 'option4', value: 'option4'},
                    {label: 'option5', value: 'option5'}
                ]
            }
        },
        {
            title: 'ComboList with ClassName',
            props: {
                className: 'floatRight',
                value: 'Main Command5',
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
            title: 'ComboList with Icon and long datasource',
            props: {
                value: 'Main Command6',
                label: ' 星星',
                icon: 'font-icon-star-half',
                datasource: [
                    {label: 'option1option1option1option1option1option1option1option1option1', value: 'option1'},
                    {label: 'option2', value: 'option2', disabled: true},
                    {label: 'option3', value: 'option3'},
                    {label: 'option4', value: 'option4'},
                    {label: 'option5', value: 'option5'},
                    {label: 'option5', value: 'option5'},
                    {label: 'option5', value: 'option5'},
                    {label: 'option5', value: 'option5'},
                    {label: 'option5', value: 'option5'},
                    {label: 'option5', value: 'option5'},
                    {label: 'option5', value: 'option5'},
                    {label: 'option5', value: 'option5'},
                    {label: 'option5', value: 'option5'},
                    {label: 'option5', value: 'option5'}
                ]
            }
        }
    ];


    return Creater(ComboList, items, 'onClick');

});
