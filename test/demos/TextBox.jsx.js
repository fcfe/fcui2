define(function (require) {

    var React = require('react');
    var TextBox = require('fcui/TextBox.jsx');

    var items = [
        {
            title: 'Normal TextBox',
            onChange: true,
            props: {}
        },
        {
            title: 'TextBox with ClassName',
            onChange: true,
            props: {className: 'marginLeft100 border2'}
        },
        {
            title: 'Readonly TextBox',
            onChange: true,
            props: {value: 'readonly'}
        },
        {
            title: 'Disabled TextBox',
            onChange: true,
            props: {disabled: true}
        },
        {
            title: 'Disabled TextBox with value',
            onChange: true,
            props: {disabled: true, value: 'value'}
        },
        {
            title: 'TextBox with Placeholder',
            onChange: true,
            props: {placeholder: 'please input'}
        },
        {
            title: 'TextBox with Placeholder with value',
            onChange: true,
            props: {value: 1, placeholder: 'please input'}
        },
        {
            title: 'TextBox with Width',
            onChange: true,
            props: {width: 500}
        },
        {
            title: 'TextBox with ValueLinker',
            valueLink: true,
            props: {}
        },
        {
            title: 'Custom Link TextBox',
            customLink: true,
            props: {}
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
                    <TextBox {...prop}/>
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
            return {};
        },
        changeHandler: function (e) {
            this.props.alert(e.target.value);
        },
        render: function () {
            return (<div>{factory(this, items)}</div>);
        }
    });
});
