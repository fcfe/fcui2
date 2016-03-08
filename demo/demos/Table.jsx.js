define(function (require) {


    var React = require('react');
    var Table = require('fcui/Table.jsx');


    var datasource = require('./config/tableDatasource');
    var fieldConfig = require('./config/tableFieldConfig');


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
            title: 'Disabled Table',
            props: {
                disable: true,
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
                    {ref: 'shadowTableContainer', top: 60, zIndex: 998}
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
                demo: 'Table',
                alert: function () {}
            };
        },
        // @override
        getInitialState: function () {
            return {};
        },
        clickHandler: function (e) {
            this.props.alert(e.target.value);
        },
        actionHandler: function (type, param) {
            this.props.alert(type + ' ' + JSON.stringify(param));
        },
        render: function () {
            var containerProp = {
                className: 'demo-content',
                style: {
                    display: this.props.demo === 'Table' ? 'block' : 'none'
                }
            };
            return (<div {...containerProp}>{factory(this, items)}</div>);
        }
    });
});
