/**
 *  带折叠按钮的列
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2
 */
define(function (require) {


    var React = require('react');


    return React.createClass({
        // @override
        getDefaultProps: function () {
            return {
                onAction: function () {}
            };
        },
        // @override
        getInitialState: function () {
            return {};
        },
        onExpanderClick: function (e) {
            var value = {
                expandId: this.props.item.expandId,
                expanded: this.props.tableExpandId + '' !== this.props.item.expandId + ''
            };
            /**
             * @fire table onAction
             * @param {String} type TableExpanderClick: 表格某行的展开按钮被点击；<TableFieldObject>.renderer = Expander
             * @param {Object} param
             * @param {String} param.expandId 操作行数据源中的expandId值，param1 = 'TableExpanderClick'
             * @param {Boolean} param.expanded 操作后该行的展开状态，param1 = 'TableExpanderClick'
             */
            typeof this.props.onAction === 'function' && this.props.onAction('TableExpanderClick', value);
        },
        render: function () {
            var buttonClass = 'font-icon'; 
            if (
                this.props.hasOwnProperty('tableExpandId')
                && this.props.item.hasOwnProperty('expandId')
            ) {
                buttonClass += (this.props.tableExpandId + '' === this.props.item.expandId + '')
                    ? ' font-icon-largeable-caret-down' : ' font-icon-largeable-caret-right';
            }
            else {
                buttonClass = '';
            }
            if (typeof this.props.item.expandId === 'string' && this.props.item.expandId.indexOf('-') > -1) {
                buttonClass = '';
            }
            return (
                <td key="row-expander" style={this.props.style}>
                    <div className={buttonClass} onClick={this.onExpanderClick} style={{cursor: 'pointer'}}></div>
                </td>
            );
        }
    });
});
