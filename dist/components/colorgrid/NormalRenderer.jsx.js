/**
 * @file ColorGrid 默认渲染器
 * @author Wang Yi
 * @email wangyispaceman@gmail.com
 * @version 0.0.2.2
 */

define(function (require) {
    var React = require('react');

    return React.createClass({
        getDefaultProps: function getDefaultProps() {
            return {
                value: '',
                disabled: false
            };
        },

        render: function render() {
            var value = JSON.parse(this.props.value);
            var containerStyle = {
                position: 'relative',
                width: 16,
                height: 16,
                border: '1px solid #169AFF',
                cursor: this.props.disabled ? 'not-allowed' : 'pointer'
            };
            var innerBlockStyle = {
                position: 'absolute',
                top: 1,
                left: 1,
                width: 14,
                height: 14,
                backgroundColor: value.hex
            };
            return React.createElement(
                'div',
                { style: containerStyle },
                React.createElement('div', { style: innerBlockStyle })
            );
        }
    });
});