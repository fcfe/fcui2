define(function (require) {

    var Creater = require('../Main.jsx');
    var ArraySelector = require('fcui/enterprise/ArraySelector.jsx');
    var defaultValue = {
        selected: [
            {value: 1, label: 'option1'},
            {value: 2, label: 'option2option2option2option2option2option2option2'},
            {value: 3, label: 'option3'},
            {value: 4, label: 'option4'}
        ],
        unselected: [
            {value: 5, label: 'option5'},
            {value: 6, label: 'option6'},
            {value: 7, label: 'option7'},
            {value: 8, label: 'option8'}
        ]
    };
    var items1 = [
        {
            title: 'Normal ArraySelector',
            props: {
                value: JSON.stringify(defaultValue),
            }
        },
        {
            title: 'DropDown ArraySelector',
            props: {
                isDropDown: true,
                value: JSON.stringify(defaultValue)
            }
        }
    ];
    return Creater(ArraySelector, items1, ['onChange']);

});
