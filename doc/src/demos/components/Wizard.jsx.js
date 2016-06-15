define(function (require) {

    var Creater = require('../main.jsx');
    var Wizard = require('fcui/Wizard.jsx');

    var items = [
        {
            title: 'Normal Wizard',
            props: {
                datasource: ['第一步', '第二步', '第三步', '第四步']
            }
        },
        {
            title: 'Disabled Wizard',
            props: {
                disabled: true,
                datasource: ['第一步', '第二步', '第三步']
            }
        },
        {
            title: 'Wizard with ClassName',
            props: {
                className: 'border2',
                datasource: ['第一步', '第二步', '第三步']
            }
        }
    ];

    return Creater(Wizard, items, 'onChange');
});
