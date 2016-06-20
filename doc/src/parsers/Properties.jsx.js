define(function (require) {


    var React = require('react');
    var Params = require('./components/Params.jsx');
    var Callback = require('./components/Callback.jsx');

    return React.createClass({
        // @override
        getDefaultProps: function () {
            return {
                item: {}
            };
        },
        render: function () {
            var item = this.props.item;
            if (item.hasOwnProperty('params') && item.params.length > 0) {
                return (
                    <div className="parser-properties">
                        <h3>this.props</h3>
                        {item.attention ? <div className="attention">{item.attention}</div> : null}
                        <Params params={item.params}/>
                        <Callback item={item}/>
                    </div>
                );
            }
            return null;
        }
    });
});
