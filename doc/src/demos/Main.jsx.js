define(function (require) {


    var React = require('react');
    var tools = require('./tools');


    function defaultFactory(Component, items, me, state, handlers) {
        var widgets = [];
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var flag =  item.title + '___showprop___';
            var demoProp = {};
            var titleProp = {
                className: 'font-icon font-icon-caret-' + (state[flag] ? 'down' : 'right'),
                onClick: me.togglePropsBoxFactory(flag)
            };
            var propboxProp = {
                className: 'props',
                dangerouslySetInnerHTML: {__html: tools.trans2html(tools.formatter(tools.getDisplayProps(item.props)))},
                style: {display: state[flag] ? 'block' : 'none'}
            };
            for (var key in item.props) {
                if (!item.props.hasOwnProperty(key)) continue;
                demoProp[key] = item.props[key];
            }
            tools.mergeHandlers(demoProp, me, state, handlers, item);
            widgets.push(
                <div className="demo-item" key={i}>
                    <h4 {...titleProp}>{item.title}</h4>
                    <div {...propboxProp}></div>
                    <span className="baseline">Display Base Line:</span>
                    <Component {...demoProp}/>
                </div>
            );
        }
        return widgets;
    }


    return  function (Component, items, handlers, factory) {
        var producer = typeof factory === 'function' ? factory : defaultFactory;
        return React.createClass({
            // @override
            getDefaultProps: function () {
                return {};
            },
            // @override
            getInitialState: function () {
                return {};
            },
            onClick: function (e) {
                typeof this.props.alert === 'function' && this.props.alert('onClick: ' + e.target.value);
            },
            onChange: function (e) {
                typeof this.props.alert === 'function' && this.props.alert('onChange: ' + e.target.value);
            },
            togglePropsBoxFactory: function (key) {
                var me = this;
                return function () {
                    var obj = {};
                    obj[key] = !me.state[key];
                    me.setState(obj);
                };
            },
            render: function () {
                return (<div>{producer(Component, items, this, this.state, handlers)}</div>);
            }
        });
    };


});
