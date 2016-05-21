/**
 * @file 数值型td
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2
 */
define(function (require) {

    var React = require('react');

    return React.createClass({
        getDefaultProps: function () {
            return {
                className: '',
                style: {},
                renderType: 'int',
                fixed: 2
            };
        },
        getInitialState: function () {
            return {};
        },
        render: function () {
            var tdProp = {
                className: 'td-number ' + this.props.className,
                style: this.props.style
            };
            var value = this.props.content;
            if (isNaN(value)) {
                value = '-';
            }
            else {
                value = value * 1;
                switch (this.props.renderType) {
                    case 'int':
                        value = parseInt(value, 10);
                        break;
                    case 'float':
                        value = value.toFixed(isNaN(this.props.fixed) ? 2 : parseInt(this.props.fixed, 10));
                        break;
                    case 'percent':
                        value = (value * 100).toFixed(2) + '%';
                        break;
                    default:

                }
            }
            return (<td {...tdProp}>{value}</td>);
        }
    });

});
