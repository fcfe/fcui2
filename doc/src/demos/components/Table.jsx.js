define(function (require) {


    var React = require('react');
    var Creater = require('../Main.jsx');
    var Table = require('fcui/Table.jsx');
    var Information = require('../Information.jsx');
    var datasource = require('./tools/tableDatasource');
    var fieldConfig = require('./tools/tableFieldConfig');
    var expandableTableFieldFactory = require('./tools/expandableTableFieldFactory');
    var expandableTableDatasourceFactory = require('./tools/expandableTableDatasourceFactory');



    var items1 = [
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
                flags: {
                    showHeader: true
                },
                noDataRenderer: require('fcui/Button.jsx'),
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
        }
    ];
    var items2 = [
        {
            title: 'Comprehensive Table',
            props: {
                flags: {
                    showHeader: true,
                    showSelector: true,
                    sortEnable: true,
                    showMessage: true,
                    showSummary: true,
                    showHorizontalScroll: true,
                    showGroupNameInHeader: true
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
                    {isSelector: true, fixed: true},
                    fieldConfig.normalName,
                    fieldConfig.normalAge,
                    fieldConfig.normalBirth,
                    fieldConfig.tipName,
                    fieldConfig.tipAge,
                    fieldConfig.tipBirth,
                    fieldConfig.styleName,
                    fieldConfig.styleAge,
                    fieldConfig.styleBirth,
                    fieldConfig.numberInt,
                    fieldConfig.buttonField
                ]
            }
        }
    ];
    items2[0].props.fieldConfig[1].groupName = '基础信息';
    items2[0].props.fieldConfig[2].groupName = '基础信息';
    items2[0].props.fieldConfig[3].groupName = '垃圾信息';
    items2[0].props.fieldConfig[4].groupName = '垃圾信息';
    items2[0].props.fieldConfig[5].groupName = '基础信息';
    items2[0].props.fieldConfig[6].groupName = '基础信息';
    items2[0].props.fieldConfig[7].groupName = '基础信息';

    var Example1 = Creater(Table, items1, 'onChange');
    var Example2 = Creater(Table, items2, 'onChange');


    return React.createClass({
        // @override
        getDefaultProps: function () {
            return {};
        },
        // @override
        getInitialState: function () {
            return {
                expandableTableData: expandableTableDatasourceFactory('0'),
                expandableTableId: '0'
            };
        },
        expandableTableAction: function (type, param) {
            this.props.alert(type + ' ' + JSON.stringify(param));
            var id = param.expanded ? param.expandId : '';
            this.setState({
                expandableTableData: expandableTableDatasourceFactory(id),
                expandableTableId: id
            });
            return {};
        },
        render: function () {
            var expandTableProps = {
                ref: 'expandableTable',
                flags: {
                    showHeader: true
                },
                datasource: this.state.expandableTableData,
                fieldConfig: expandableTableFieldFactory(),
                onAction: this.expandableTableAction,
                value: JSON.stringify({
                    tableExpandId: this.state.expandableTableId,
                    sortField: '',
                    sortType: 'asc',
                    selected: [1],
                    indeterminate: [0]
                })
            };
            return (
                <div>
                    <Example1 alert={this.props.alert}/>
                    <div className="demo-item">
                        <Information title="Expandable Table" props={expandTableProps}/>
                        <Table {...expandTableProps}/>
                    </div>
                    <Example2 alert={this.props.alert}/>
                </div>
            );
        }
    });

});
