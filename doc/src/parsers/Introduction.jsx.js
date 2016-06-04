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
            return (
                <div></div>
            );
        }
    });
});
