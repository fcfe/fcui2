/**
 *  行选择器
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2
 */
define(function (require) {


    var React = require('react');
    var CheckBox = require('../../CheckBox.jsx');


    return React.createClass({
        // @override
        getDefaultProps: function () {
            return {
                ___isRowSelected___: -1,
                row: -1,
                disabled: false,
                onRowSelect: function () {}
            };
        },
        // @override
        getInitialState: function () {
            return {};
        },
        render: function () {
            var checkboxProp = {
                value: this.props.row + '',
                checked: this.props.___isRowSelected___ === 0,
                indeterminate: this.props.___isRowSelected___ === 1,
                disabled: this.props.disabled,
                onChange: this.props.onRowSelect
            };
            return (
                <td key="row-select" className="td-selector" style={this.props.style}>
                    <CheckBox {...checkboxProp} />
                </td>
            );
        }
    });
});
