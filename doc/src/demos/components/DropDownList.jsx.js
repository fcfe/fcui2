define(function (require) {


    var DropDownList = require('fcui2/DropDownList.jsx');
    var Creater = require('../Main.jsx');


    var items = [
        {
            title: 'Normal DropDownList',
            props: {
                label: 'Command List',
                skin: 'grey',
                datasource: [
                    {label: 'option1', value: 'option1', disabled: true},
                    {label: 'option2', value: 'option2'},
                    {label: 'option3', value: 'option3'},
                    {label: 'option4', value: 'option4'},
                    {label: 'option5', value: 'option5'},
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
            title: 'Skin Blue DropDownList',
            props: {
                label: 'Command List',
                skin: 'blue',
                datasource: [
                    {label: 'option1', value: 'option1', disabled: true},
                    {label: 'option2', value: 'option2'},
                    {label: 'option3', value: 'option3'},
                    {label: 'option4', value: 'option4'},
                    {label: 'option5', value: 'option5'},
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
            title: 'Disabled DropDownList',
            props: {
                disabled: true,
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
            title: 'DropDownList without Datasource',
            props: {
                value: 'option3',
                datasource: []
            }
        },
        {
            title: 'DropDownList with Style',
            props: {
                placeholder: 'select',
                style: {
                    width: 200,
                },
                datasource: [
                    {label: 'option1option1option1option1option1option1option1option1option1', value: 'option1'},
                    {label: 'option2', value: 'option2'},
                    {label: 'option3', value: 'option3'},
                    {label: 'option4', value: 'option4'},
                    {label: 'option5', value: 'option5'}
                ]
            }
        },
        {
            title: 'DropDownList with ClassName',
            props: {
                placeholder: 'select',
                width: 50,
                className: 'floatRight',
                datasource: [
                    {label: 'option1option1option1option1option1option1option1option1option1', value: 'option1'},
                    {label: 'option2', value: 'option2'},
                    {label: 'option3', value: 'option3'},
                    {label: 'option4', value: 'option4'},
                    {label: 'option5', value: 'option5'}
                ]
            }
        }
    ];

    
    return Creater(DropDownList, items, 'onClick');
});
