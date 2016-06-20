/**
 * table 有选择功能的单元格渲染器
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2.1
 */
define(function (require) {


    var React = require('react');
    var CheckBox = require('../../CheckBox.jsx');


    return React.createClass({
        // @override
        /**
         * @properties
         * @param {Number} ___isRowSelected___ 行选择状态：
         * -1: 未选择
         *  0: 选择
         *  1: 半选择 （有倒霉的业务需要半选择状态，这个一般跟有折叠功能的表格一起使用）
         * @param {Boolean} disabled 是否禁用
         * @param {Function} onRowSelect 回调函数，一般为table.props.onAction
         */
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
