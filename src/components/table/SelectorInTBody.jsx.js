/**
 * @file 行选择器
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
                ___isRowSelected___: false,
                row: -1,
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
                checked: this.props.___isRowSelected___,
                onChange: this.props.onRowSelect
            };
            return (
                <td key="row-select" className="td-selector">
                    <CheckBox {...checkboxProp} />
                </td>
            );
        }
    });
});
