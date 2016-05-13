define(function (require) {

    var React = require('react');
    var SearchBox = require('fcui/SearchBox.jsx');

    var items = [
        {
            title: 'Normal SearchBox',
            onChange: true,
            props: {}
        },
        {
            title: 'SearchBox with ClassName',
            onChange: true,
            props: {className: 'marginLeft100 border2'}
        },
        {
            title: 'Readonly SearchBox',
            onChange: true,
            props: {value: 'readonly'}
        },
        {
            title: 'Disabled SearchBox',
            onChange: true,
            props: {disabled: true}
        },
        {
            title: 'SearchBox with Placeholder',
            onChange: true,
            props: {placeholder: 'please input'}
        },
        {
            title: 'SearchBox with Width',
            onChange: true,
            props: {width: 500}
        },
        {
            title: 'SearchBox with ValueLinker',
            valueLink: true,
            props: {}
        },
        {
            title: 'Custom Link SearchBox',
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
            prop.onClick = me.changeHandler;
            widgets.push(
                <div className="demo-item" key={i}>
                    <h3>{item.title}</h3>
                    <div className="props">{conf}</div>
                    <SearchBox {...prop}/>
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
