/**
 * Table 普通表头渲染器
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2.1
 */
define(function (require) {

    var Tip = require('../../Tip.jsx');
    var React = require('react');

    return React.createClass({

        // @override
        /**
         * @properties
         * @param {Object} fieldConfig 表头所在列的配置信息
         * @param {ReactComponent} tableComponent 表格实例
         */
        getDefaultProps: function getDefaultProps() {
            return {
                fieldConfig: {},
                tableComponent: {}
            };
        },

        onSortClick: function onSortClick(e) {
            var table = this.props.tableComponent;
            var tableValue = this.props.tableComponent.___getValue___() || '{}';
            var fieldConfig = this.props.fieldConfig;
            tableValue = JSON.parse(tableValue);
            tableValue.sortField = tableValue.sortField || '';
            tableValue.sortType = tableValue.sortType || 'asc';
            if (tableValue.sortField === fieldConfig.field) {
                tableValue.sortType = tableValue.sortType === 'asc' ? 'desc' : 'asc';
            } else {
                tableValue.sortField = fieldConfig.field;
                tableValue.sortType = 'desc';
            }
            e.target.value = JSON.stringify(tableValue);
            table.___dispatchChange___(e);
        },

        render: function render() {
            var table = this.props.tableComponent;
            var tableFlags = table.props.flags || {};
            var tableValue = table.___getValue___() || '{}';
            var fieldConfig = this.props.fieldConfig;
            var sortEnable = tableFlags.sortEnable && !fieldConfig.sortDisable;
            tableValue = JSON.parse(tableValue);
            var sortField = tableValue.sortField || '';
            var sortType = tableValue.sortType || 'desc';
            if (sortField !== fieldConfig.field) {
                sortType = 'desc'; //desc 降序 asc升序
            }
            var sortButtonProp = {
                className: 'sort-button fcui2-icon ' + (sortType === 'asc' ? 'fcui2-icon-asc' : 'fcui2-icon-desc'),
                style: {
                    display: sortEnable ? 'inline-block' : 'none',
                    color: sortField !== fieldConfig.field ? '#DEDEDE' : '#2F82F5'
                },
                onClick: this.onSortClick
            };
            var rowSpan = +this.props.rowSpan;
            var thProp = {
                className: 'th-header',
                rowSpan: isNaN(rowSpan) || !rowSpan ? undefined : rowSpan,
                style: {
                    textAlign: fieldConfig.align || 'left',
                    verticalAlign: fieldConfig.verticalAlign || 'top'
                }
            };
            return React.createElement(
                'th',
                thProp,
                React.createElement(
                    'span',
                    null,
                    fieldConfig.label
                ),
                React.createElement(Tip, fieldConfig.tip),
                React.createElement('div', sortButtonProp)
            );
        }
    });
});