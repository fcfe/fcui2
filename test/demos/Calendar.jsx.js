define(function (require) {


    var React = require('react');
    var Calendar = require('fcui/Calendar.jsx');

    var timer = new Date();

    var items = [
        {
            title: 'Normal Calendar',
            onChange: true,
            props: {}
        },
        {
            title: 'Calendar with ClassName',
            onChange: true,
            props: {className: 'marginLeft100 border2'}
        },
        {
            title: 'Readonly Calendar',
            onChange: true,
            props: {value: timer.getFullYear() + '-' + (timer.getMonth() + 1) + '-' + timer.getDate()}
        },
        {
            title: 'Disabled Calendar',
            onChange: true,
            props: {disable: true}
        },
        {
            title: 'Calendar with ValueLinker',
            valueLink: true,
            props: {}
        },
        {
            title: 'Custom Link Calendar',
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
                    <Calendar {...prop}/>
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
                demo: 'Calendar',
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
                    display: this.props.demo === 'Calendar' ? 'block' : 'none'
                }
            };
            return (<div {...containerProp}>{factory(this, items)}</div>);
        }
    });
});
