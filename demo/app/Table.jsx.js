define(function (require) {


    var React = require('react');
    var Table = require('fcui/Table.jsx');


    var datasource = require('../config/tableDatasource');
    var fieldConfig = require('../config/tableFieldConfig');


    var items = [
        {
            title: 'Normal Table',
            props: {
                datasource: datasource,
                fieldConfig: [
                    fieldConfig.normalName, fieldConfig.normalAge, fieldConfig.normalBirth
                ]
            }
        },
        {
            title: 'Table without Datasource',
            props: {
                fieldConfig: [
                    fieldConfig.normalName, fieldConfig.normalAge, fieldConfig.normalBirth
                ]
            }
        },
        {
            title: 'Table with Style',
            props: {
                datasource: datasource,
                fieldConfig: [
                    fieldConfig.styleName, fieldConfig.styleAge, fieldConfig.styleBirth
                ]
            }
        },
        {
            title: 'Table with Header',
            props: {
                flags: {
                    showHeader: true
                },
                datasource: datasource,
                fieldConfig: [
                    fieldConfig.normalName, fieldConfig.normalAge, fieldConfig.normalBirth
                ]
            }
        },
        {
            title: 'Table with Tip in Header',
            props: {
                flags: {
                    showHeader: true
                },
                datasource: datasource,
                fieldConfig: [
                    fieldConfig.tipName, fieldConfig.tipAge, fieldConfig.tipBirth
                ]
            }
        },
        {
            title: 'Sortable Table',
            onChange: true,
            props: {
                flags: {
                    showHeader: true,
                    sortEnable: true
                },
                datasource: datasource,
                fieldConfig: [
                    fieldConfig.normalName, fieldConfig.normalAge, fieldConfig.normalBirth
                ]
            }
        },
        {
            title: 'Table with Value',
            props: {
                flags: {
                    showHeader: true,
                    sortEnable: true
                },
                value: JSON.stringify({
                    sortField: 'age',
                    sortType: 'desc'
                }),
                datasource: datasource,
                fieldConfig: [
                    fieldConfig.normalName, fieldConfig.normalAge, fieldConfig.normalBirth
                ]
            }
        },
        {
            title: 'Table with ValueLink',
            valueLink: true,
            props: {
                flags: {
                    showHeader: true,
                    sortEnable: true
                },
                datasource: datasource,
                fieldConfig: [
                    fieldConfig.normalName, fieldConfig.normalAge, fieldConfig.normalBirth
                ]
            }
        },
        {
            title: 'Table with Summary',
            props: {
                flags: {
                    showHeader: true,
                    showSummary: true
                },
                datasource: datasource,
                summary: {
                    name: '老司机',
                    age: '18'
                },
                fieldConfig: [
                    fieldConfig.normalName, fieldConfig.normalAge, fieldConfig.normalBirth
                ]
            }
        },
        {
            title: 'Table with Message',
            props: {
                flags: {
                    showHeader: true,
                    showMessage: true
                },
                message: {
                    content: '这是一条信息',
                    buttonLabel: '知道了'
                },
                datasource: datasource,
                fieldConfig: [
                    fieldConfig.normalName, fieldConfig.normalAge, fieldConfig.normalBirth
                ]
            }
        },
        {
            title: 'Table with Selector',
            onChange: true,
            props: {
                flags: {
                    showHeader: true,
                    showSelector: true
                },
                datasource: datasource,
                fieldConfig: [
                    fieldConfig.normalName, fieldConfig.normalAge, fieldConfig.normalBirth
                ]
            }
        },
        {
            title: 'Table with Selector that can select current page.',
            onChange: true,
            props: {
                flags: {
                    showHeader: true,
                    showSelector: 2
                },
                datasource: datasource,
                fieldConfig: [
                    fieldConfig.normalName, fieldConfig.normalAge, fieldConfig.normalBirth
                ]
            }
        },
        {
            title: 'Table with Selector that can select all items.',
            onChange: true,
            props: {
                flags: {
                    showHeader: true,
                    showSelector: 3
                },
                datasource: datasource,
                fieldConfig: [
                    fieldConfig.normalName, fieldConfig.normalAge, fieldConfig.normalBirth
                ]
            }
        },
        {
            title: 'Disabled Table',
            props: {
                disabled: true,
                flags: {
                    showHeader: true,
                    showSelector: true
                },
                datasource: datasource,
                fieldConfig: [
                    fieldConfig.normalName, {isSelector: true},fieldConfig.normalAge, fieldConfig.normalBirth
                ]
            }
        },
        {
            title: 'Comprehensive Table',
            onChange: true,
            props: {
                flags: {
                    showHeader: true,
                    showSelector: true,
                    sortEnable: true,
                    showMessage: true,
                    showSummary: true
                },
                fixedPosition: [
                    {ref: 'shadowTableContainer', top: 60, zIndex: 8}
                ],
                message: {
                    content: '表格有新数据',
                    buttonLabel: '刷新'
                },
                summary: {
                    name: '老司机',
                    age: 60
                },
                datasource: datasource.concat(datasource, datasource, datasource),
                fieldConfig: [
                    fieldConfig.styleName, fieldConfig.tipName, fieldConfig.tipAge,
                    fieldConfig.buttonField, fieldConfig.optMsg, fieldConfig.numberInt
                ]
            }
        }
    ];


    function expandTableDatasourceFactory(filter) {
        var header = datasource[0];
        var data = [];
        for (var i = 0; i < 4; i++) {
            var newHeader = JSON.parse(JSON.stringify(header));
            newHeader.expandId = i + '';
            data.push(newHeader);
            if (i + '' !== filter) continue;
            var newItems = JSON.parse(JSON.stringify(datasource));
            for (var j = 0; j < newItems.length; j++) {
                newItems[j].expandId = i + '-' + j;
                data.push(newItems[j]);
            }
        }
        return data;
    }
    function expandTableFieldFactory() {
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
    }
    function expandTableDemo(me) {
        var props = {
            ref: 'expandTable',
            flags: {
                showHeader: true
            },
            datasource: me.state.expandData,
            fieldConfig: expandTableFieldFactory(),
            onAction: me.expandTableAction,
            valueTemplate: JSON.stringify({
                tableExpandId: me.state.expandId,
                sortField: '',
                sortType: 'asc',
                selected: []
            })
        };
        return <Table {...props}/>
    }


    function factory(me, items) {
        var widgets = [];
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var prop = item.props;
            var conf = JSON.stringify(prop);
            if (item.valueLink) prop.valueLink = me.linkState(item.title);
            if (item.onChange) prop.onChange = me.clickHandler;
            prop.onAction = me.actionHandler;
            widgets.push(
                <div className="demo-item" key={i}>
                    <h3>{item.title}</h3>
                    <div className="props">{conf}</div>
                    <Table {...prop}/>
                    <span>{me.state[item.title]}</span>
                </div>
            );
        }
        return widgets;
    }


    return React.createClass({
        mixins: [React.addons.LinkedStateMixin],
        // @override
        getDefaultProps: function () {
            return {
                alert: function () {}
            };
        },
        // @override
        getInitialState: function () {
            return {
                expandData: expandTableDatasourceFactory('0'),
                expandId: '0'
            };
        },
        clickHandler: function (e) {
            this.props.alert(e.target.value);
        },
        expandTableAction: function (type, param) {
            this.props.alert(type + ' ' + JSON.stringify(param));
            var data = [];
            var id = '';
            if (param.expanded) {
                data = expandTableDatasourceFactory(param.expandId);
                id = param.expandId;
            }
            else {
                data = expandTableDatasourceFactory('');
            }
            this.setState({
                expandData: data,
                expandId: id
            });
        },
        actionHandler: function (type, param) {
            this.props.alert(type + ' ' + JSON.stringify(param));
        },
        render: function () {
            return (
                <div>
                    <div className="demo-item">
                        <h3>Table width Expander</h3>
                        {expandTableDemo(this)}
                    </div>
                    {factory(this, items)}
                </div>
            );
        }
    });
});
