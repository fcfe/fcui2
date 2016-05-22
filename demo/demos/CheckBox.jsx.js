define(function (require) {

    var React = require('react');
    var CheckBox = require('fcui/CheckBox.jsx');

    var items = [
        {
            title: 'Normal CheckBox',
            onChange: true,
            props: {}
        },
        {
            title: 'CheckBox with ClassName',
            onChange: true,
            props: {label: '请选择：', className: 'marginLeft100 border2'}
        },
        {
            title: 'CheckBox with Label',
            onChange: true,
            props: {label: '请选择：'}
        },
        {
            title: 'CheckBox with Indeterminate',
            onChange: true,
            props: {indeterminate: true}
        },
        {
            title: 'CheckBox with right Label',
            onChange: true,
            props: {label: '这是啥', labelPosition: 'right'}
        },
        {
            title: 'Disabled CheckBox',
            onChange: true,
            props: {disabled: true, label: '请选择'}
        },
        {
            title: 'Readonly CheckBox',
            onChange: true,
            props: {checked: true}
        },
        {
            title: 'CheckBox with ValueLink',
            valueLink: true,
            props: {}
        }
    ];

    function setter(me, field) {
        return function (e) {
            var obj = {};
            obj[field] = e.target.checked + '';
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
                    <CheckBox {...prop}/>
                    <span>{me.state[item.title] === undefined ? '' : me.state[item.title] + ''}</span>
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
            return {};
        },
        changeHandler: function (e) {
            this.props.alert(e.target.checked + '');
        },
        render: function () {
            return (<div>{factory(this, items)}</div>);
        }
    });
});
