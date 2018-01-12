/**
 * @file 为 React child components 提供'oneux4'的appSkin值刀到child context type中
 */
define(function (require) {

    var React = require('react');

    return React.createClass({

        // @override
        getDefaultProps: function getDefaultProps() {
            return {
                skin: 'oneux3'
            };
        },

        // @override
        childContextTypes: {
            appSkin: React.PropTypes.string
        },

        // @override
        getChildContext: function getChildContext() {
            return {
                appSkin: this.props.skin
            };
        },
        render: function render() {
            var className = 'fcui2-' + this.props.skin + '-wrapper' + (this.props.className ? ' ' + this.props.className : '');
            return React.createElement(
                'div',
                { className: className },
                this.props.children
            );
        }
    });
});