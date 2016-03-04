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
                    hideHeader: false
                },
                datasource: datasource,
                fieldConfig: [
                    fieldConfig.styleName, fieldConfig.styleAge, fieldConfig.styleBirth
                ]
            }
        },
        {
            title: 'Table with Tip in Header',
            props: {
                flags: {
                    hideHeader: false
                },
                datasource: datasource,
                fieldConfig: [
                    fieldConfig.tipName, fieldConfig.tipAge, fieldConfig.tipBirth
                ]
            }
        },
        {
            title: 'Table with SortButton in Header',
            props: {
                flags: {
                    hideHeader: false,
                    sortAble: true
                },
                datasource: datasource,
                fieldConfig: [
                    fieldConfig.normalName, fieldConfig.normalAge, fieldConfig.normalBirth
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
            if (item.valueLink) {
                prop.valueLink = me.linkState(item.title);
            }
            widgets.push(
                <div className="demo-item" key={i}>
                    <h3>{item.title}</h3>
                    <div className="props">{conf}</div>
                    <Table {...prop}/>
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