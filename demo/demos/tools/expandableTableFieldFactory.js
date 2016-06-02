define(function (require) {

    var fieldConfig = require('./tableFieldConfig');

    return function () {

        var nameField = fieldConfig.normalName;
        var ageField = fieldConfig.normalAge;
        var birthField = fieldConfig.normalBirth;
        var stylePrepare = function (props, item, row, column, table) {
            if (item.expandId && item.expandId.indexOf('-') < 0) {
                props.style.fontWeight = 'bold';
                props.style.backgroundColor = '#F8F9FE';
            }   
        };

        nameField.prepare = stylePrepare;
        ageField.prepare = stylePrepare;
        birthField.prepare = stylePrepare;

        var fields = [
            {
                isEmptyHeader: true,
                width: 30,
                renderer: require('fcui/components/table/Expander.jsx'),
                prepare: function (props, item, row, column, table) {
                    var value = JSON.parse(table.___getValue___());
                    props.tableExpandId = value.tableExpandId;
                    props.onAction = table.props.onAction;
                    if (item.expandId && item.expandId.indexOf('-') < 0) {
                        props.style.fontWeight = 'bold';
                        props.style.backgroundColor = '#F8F9FE';
                    }
                }
            },
            {
                isSelector: true,
                prepare: stylePrepare
            },
            nameField,
            ageField,
            birthField
        ];
        return fields;

    };
});
