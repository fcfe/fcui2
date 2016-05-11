define(function (require) {

    var React = require('react');
    var Pager = require('fcui/Pager.jsx');

    var items = [
        {
            title: 'Normal Pager',
            onChange: true,
            props: {}
        },
        {
            title: 'Pager with ClassName',
            onChange: true,
            props: {className: 'floatRight'}
        },
        {
            title: 'Readonly Pager',
            props: {value: '4'}
        },
        {
            title: 'Disabled Pager',
            onChange: true,
            props: {disabled: true}
        },
        {
            title: 'Pager with ValueLinker',
            valueLink: true,
            props: {}
        },
        {
            title: 'Custom Link Pager',
            customLink: true,
            props: {}
        },
        {
            title: 'Pager with Setting',
            props: {min: 10, max: 30, threshold: 2, value: 30}
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
                    <Pager {...prop}/>
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
