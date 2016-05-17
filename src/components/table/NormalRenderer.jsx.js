/**
 * @file 普通td
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.1
 */
define(function (require) {
    var React = require('react');
    return React.createClass({
        getDefaultProps: function () {
            return {
                className: '',
                content: '',
                style: {},
            };
        },
        getInitialState: function () {
            return {};
        },
        render: function () {
            var tdProp = {
                className: 'td-button ' + this.props.className,
                style: this.props.style
            };
            return (
                <td {...tdProp}>{this.props.content}</td>
            );
        }
    });
});
