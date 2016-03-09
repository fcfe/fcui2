define(function (require) {

    var React = require('react');
    var TextArea = require('fcui/TextArea.jsx');

    var items = [
        {
            title: 'Normal TextArea',
            onChange: true,
            props: {}
        },
        {
            title: 'TextArea with ClassName',
            onChange: true,
            props: {className: 'marginLeft100 border2'}
        },
        {
            title: 'Readonly TextArea',
            onChange: true,
            props: {value: 'readonly'}
        },
        {
            title: 'Disabled TextArea',
            onChange: true,
            props: {disable: true}
        },
        {
            title: 'TextArea with Placeholder',
            onChange: true,
            props: {placeholder: 'please input'}
        },
        {
            title: 'TextArea with Size',
            onChange: true,
            props: {width: 500, height: 300}
        },
        {
            title: 'TextArea with ValueLinker',
            valueLink: true,
            props: {}
        },
        {
            title: 'Custom Link TextArea',
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
                    <TextArea {...prop}/>
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
                demo: 'TextArea',
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
                    display: this.props.demo === 'TextArea' ? 'block' : 'none'
                }
            };
            return (<div {...containerProp}>{factory(this, items)}</div>);
        }
    });
});
