define(function (require) {


    var React = require('react');
    var Information = require('./Information.jsx');
    var tools = require('./tools');


    function defaultFactory(Component, items, me, state, handlers) {
        var widgets = [];
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var demoProp = {};
            for (var key in item.props) {
                if (!item.props.hasOwnProperty(key)) continue;
                demoProp[key] = item.props[key];
            }
            tools.mergeHandlers(demoProp, me, state, handlers, item);
            widgets.push(
                <div className="demo-item" key={i}>
                    <Information title={item.title} props={item.props}/>
                    <span>&nbsp;</span>
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
            render: function () {
                return (<div>{producer(Component, items, this, this.state, handlers)}</div>);
            }
        });
    };


});
