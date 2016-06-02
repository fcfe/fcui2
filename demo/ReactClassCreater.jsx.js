define(function (require) {


    var React = require('react');


    function defaultFactory(Component, items, me, state, handlers) {
        var widgets = [];
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var prop = {};
            for (var key in item.props) {
                if (!item.props.hasOwnProperty(key)) continue;
                prop[key] = item.props[key];
            }
            mergeHandlers(prop, me, state, handlers, item);
            widgets.push(
                <div className="demo-item" key={i}>
                    <h3>{item.title}</h3>
                    <div className="props">{getDisplayProps(item.props)}</div>
                    <span className="label">Display Base Line:</span>
                    <Component {...prop}/>
                </div>
            );
        }
        return widgets;
    }


    function mergeHandlers(prop, me, state, handlers, config) {
        if (typeof handlers !== 'string' && !(handlers instanceof Array)) return;
        handlers = typeof handlers === 'string' ? [handlers] : handlers;
        for (var i = 0; i < handlers.length; i++) {
            var key = handlers[i];
            if (prop.hasOwnProperty(key) || !me.hasOwnProperty(key)) continue;
            if (key === 'onChange') {
                prop.value = prop.hasOwnProperty('value') ? prop.value : state[config.title];
                if (config[key] !== false) {
                    prop.onChange = function (e) {
                        var obj = {};
                        obj[config.title] = e.target.value;
                        me.setState(obj);
                        me.onChange(e);
                    };
                }
            }
            else {
                if (config[key] !== false) prop[key] = me[key];
            }
        }
    }


    function getDisplayProps(props) {
        var result = JSON.parse(JSON.stringify(props));
        for (var key in props) {
            if (!props.hasOwnProperty(key)) continue;
            if (typeof props[key] === 'function') {
                result[key] = '[Function]';
            }
        }
        return JSON.stringify(result);
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
            render: function () {
                return (<div>{producer(Component, items, this, this.state, handlers)}</div>);
            }
        });
    };


});
