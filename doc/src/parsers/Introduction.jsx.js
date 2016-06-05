define(function (require) {

    var React = require('react');

    return React.createClass({
        // @override
        getDefaultProps: function () {
            return {
                item: {}
            };
        },
        render: function () {
            var item = this.props.item;
            return (
                <div className="parser-introduction">
                    <h3>{item.description + ' v' + item.version}</h3>
                    <div>{item.author + ' (' + item.email + ')'}</div>
                </div>
            );
        }
    });
});
