define(function (require) {

    var React = require('react');
    var Select = require('fcui/Select.jsx');

    var items = [
        {
            title: 'Normal Select',
            onChange: true,
            props: {
                placeholder: 'select',
                datasource: [
                    {label: 'option1', value: 'option1'},
                    {label: 'option2', value: 'option2', disable: true},
                    {label: 'option3', value: 'option3'},
                    {label: 'option4', value: 'option4'},
                    {label: 'option5', value: 'option5'}
                ],
                layerPolicymaker: function (obj) {return obj.datasource.length > 0;}
            }
        },
        {
            title: 'Disabled Select',
            onChange: true,
            props: {
                placeholder: 'select',
                disable: true,
                datasource: [
                    {label: 'option1', value: 'option1'},
                    {label: 'option2', value: 'option2', disable: true},
                    {label: 'option3', value: 'option3'},
                    {label: 'option4', value: 'option4'},
                    {label: 'option5', value: 'option5'}
                ],
                layerPolicymaker: function (obj) {return obj.datasource.length > 0;}
            }
        },
        {
            title: 'Readonly Select',
            onChange: true,
            props: {
                placeholder: 'select',
                value: 'option3',
                datasource: [
                    {label: 'option1', value: 'option1'},
                    {label: 'option2', value: 'option2', disable: true},
                    {label: 'option3', value: 'option3'},
                    {label: 'option4', value: 'option4'},
                    {label: 'option5', value: 'option5'}
                ],
                layerPolicymaker: function (obj) {return obj.datasource.length > 0;}
            }
        },
        {
            title: 'Select without Datasource',
            props: {
                value: 'option3',
                datasource: [],
                layerPolicymaker: function (obj) {return obj.datasource.length > 0;}
            }
        },
        {
            title: 'Select with MinWidth and a very long Option',
            onChange: true,
            props: {
                placeholder: 'select',
                minWidth: 200,
                datasource: [
                    {label: 'option1option1option1option1option1option1option1option1option1', value: 'option1'},
                    {label: 'option2', value: 'option2', disable: true},
                    {label: 'option3', value: 'option3'},
                    {label: 'option4', value: 'option4'},
                    {label: 'option5', value: 'option5'}
                ],
                layerPolicymaker: function (obj) {return obj.datasource.length > 0;}
            }
        },
        {
            title: 'Select with Width and a very long Option',
            onChange: true,
            props: {
                placeholder: 'select',
                width: 150,
                datasource: [
                    {label: 'option1option1option1option1option1option1option1option1option1', value: 'option1'},
                    {label: 'option2', value: 'option2', disable: true},
                    {label: 'option3', value: 'option3'},
                    {label: 'option4', value: 'option4'},
                    {label: 'option5', value: 'option5'}
                ],
                layerPolicymaker: function (obj) {return obj.datasource.length > 0;}
            }
        },
        {
            title: 'Select with ClassName',
            onChange: true,
            props: {
                placeholder: 'select',
                width: 150,
                className: 'floatRight',
                datasource: [
                    {label: 'option1option1option1option1option1option1option1option1option1', value: 'option1'},
                    {label: 'option2', value: 'option2', disable: true},
                    {label: 'option3', value: 'option3'},
                    {label: 'option4', value: 'option4'},
                    {label: 'option5', value: 'option5'}
                ],
                layerPolicymaker: function (obj) {return obj.datasource.length > 0;}
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
            if (item.onChange) prop.onChange = me.changeHandler;
            if (item.valueLink) {
                prop.valueLink = me.linkState(item.title);
                conf = '{valueLink: this.linkState(\'message\')}';
            }
            if (item.customLink) {
                prop.value = me.state[item.title];
                prop.onChange = setter(me, item.title);
                conf = '{value: this.state.message, onChange: this.changeHandler}';
            }
            widgets.push(
                <div className="demo-item" key={i}>
                    <h3>{item.title}</h3>
                    <div className="props">{conf}</div>
                    <Select {...prop}/>
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
                demo: 'Select',
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
                    display: this.props.demo === 'Select' ? 'block' : 'none'
                }
            };
            return (<div {...containerProp}>{factory(this, items)}</div>);
        }
    });
});
