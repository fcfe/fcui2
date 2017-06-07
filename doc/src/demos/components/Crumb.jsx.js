define(function (require) {

    var Creater = require('../Main.jsx');
    var Crumb = require('fcui2/Crumb.jsx');

    var items = [
        {
            title: 'Normal Crumb',
            props: {
                datasource: [
                    {label: 'option1', href: 'option1', target: "_blank"},
                    {label: 'option2', href: 'option2', target: "_blank"},
                    {label: 'option3', href: 'option3', target: "_blank"},
                    {label: 'option4', href: 'option4', target: "_blank"},
                    {label: 'option5', href: 'option5', target: "_blank"}
                ]
            }
        },
        {
            title: 'Disabled Crumb',
            props: {
                disabled: true,
                datasource: [
                    {label: 'option1', href: 'option1', target: "_blank"},
                    {label: 'option2', href: 'option2', target: "_blank"},
                    {label: 'option3', href: 'option3', target: "_blank"},
                    {label: 'option4', href: 'option4', target: "_blank"},
                    {label: 'option5', href: 'option5', target: "_blank"}
                ]
            }
        },
        {
            title: 'Crumb with Disabled Item',
            props: {
                datasource: [
                    {label: 'option1', href: 'option1', target: "_blank"},
                    {label: 'option2', href: 'option2', disabled: true},
                    {label: 'option3', href: 'option3', target: "_blank"},
                    {label: 'option4', href: 'option4', target: "_blank"},
                    {label: 'option5', href: 'option5', target: "_blank"}
                ]
            }
        },
        {
            title: 'Crumb with ClassName',
            props: {
                className: 'border2',
                datasource: [
                    {label: 'option1', href: 'option1', target: "_blank"},
                    {label: 'option2', href: 'option2', disabled: true},
                    {label: 'option3', href: 'option3', target: "_blank"},
                    {label: 'option4', href: 'option4', target: "_blank"},
                    {label: 'option5', href: 'option5', target: "_blank"}
                ]
            }
        },
        {
            title: 'Crumb with Separator',
            props: {
                separator: '|',
                datasource: [
                    {label: 'option1', href: 'option1', target: "_blank"},
                    {label: 'option2', href: 'option2', disabled: true},
                    {label: 'option3', href: 'option3', target: "_blank"},
                    {label: 'option4', href: 'option4', target: "_blank"},
                    {label: 'option5', href: 'option5', target: "_blank"}
                ]
            }
        }
    ];


    return Creater(Crumb, items);
});
