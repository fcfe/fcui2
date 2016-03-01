define(function (require) {

    var React = require('react');
    var ComboList = require('fcui/ComboList.jsx');

    var items = [
        {
            title: 'Normal ComboList',
            props: {
                label: 'Main Command1',
                value: 'Main Command1',
                datasource: [
                    {label: 'option1', value: 'option1'},
                    {label: 'option2', value: 'option2', disable: true},
                    {label: 'option3', value: 'option3'},
                    {label: 'option4', value: 'option4'},
                    {label: 'option5', value: 'option5'}
                ]
            }
        },
        {
            title: 'Disabled ComboList',
            props: {
                disable: true,
                value: 'Main Command2',
                datasource: [
                    {label: 'option1', value: 'option1'},
                    {label: 'option2', value: 'option2', disable: true},
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
            onChange: true,
            props: {
                value: 'Main Command4',
                datasource: [
                    {label: 'option1option1option1option1option1option1option1option1option1', value: 'option1'},
                    {label: 'option2', value: 'option2', disable: true},
                    {label: 'option3', value: 'option3', disable: true},
                    {label: 'option4', value: 'option4'},
                    {label: 'option5', value: 'option5'}
                ]
            }
        },
        {
            title: 'ComboList with ClassName',
            onChange: true,
            props: {
                className: 'floatRight',
                value: 'Main Command5',
                datasource: [
                    {label: 'option1option1option1option1option1option1option1option1option1', value: 'option1'},
                    {label: 'option2', value: 'option2', disable: true},
                    {label: 'option3', value: 'option3'},
                    {label: 'option4', value: 'option4'},
                    {label: 'option5', value: 'option5'}
                ]
            }
        },
        {
            title: 'ComboList with Icon',
            onChange: true,
            props: {
                value: 'Main Command6',
                icon: 'font-icon-star-half',
                datasource: [
                    {label: 'option1option1option1option1option1option1option1option1option1', value: 'option1'},
                    {label: 'option2', value: 'option2', disable: true},
                    {label: 'option3', value: 'option3'},
                    {label: 'option4', value: 'option4'},
                    {label: 'option5', value: 'option5'}
                ]
            }
        }
    ];

    function setter(me, field) {
        return function (e) {
            var obj = {};
            obj[field] = e.target.value;
            me.setState(obj);
        }
    }

    function factory(me, items) {
        var widgets = [];
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var prop = item.props;
            var conf = JSON.stringify(prop);
            prop.onClick = me.changeHandler;
            widgets.push(
                <div className="demo-item" key={i}>
                    <h3>{item.title}</h3>
                    <div className="props">{conf}</div>
                    <ComboList {...prop}/>
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
                demo: 'ComboList',
                alert: function () {}
            };
        },
        // @override
        getInitialState: function () {
            return {};
        },
        changeHandler: function (e) {
            this.props.alert(e.target.value);
        },
        render: function () {
            var containerProp = {
                className: 'demo-content',
                style: {
                    display: this.props.demo === 'ComboList' ? 'block' : 'none'
                }
            };
            return (<div {...containerProp}>{factory(this, items)}</div>);
        }
    });
});
