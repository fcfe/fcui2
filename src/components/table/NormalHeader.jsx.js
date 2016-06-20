/**
 * table 普通表头渲染器
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
        getDefaultProps: function () {
            return {
                fieldConfig: {},
                tableComponent: {}
            };
        },


        onSortClick: function (e) {
            var table = this.props.tableComponent;
            var tableValue = this.props.tableComponent.___getValue___() || '{}';
            var fieldConfig = this.props.fieldConfig;
            tableValue = JSON.parse(tableValue);
            tableValue.sortField = tableValue.sortField || '';
            tableValue.sortType = tableValue.sortType || 'asc';
            if (tableValue.sortField === fieldConfig.field) {
                tableValue.sortType = tableValue.sortType === 'asc' ? 'desc' : 'asc';
            }
            else {
                tableValue.sortField = fieldConfig.field;
                tableValue.sortType = 'desc';
            }
            e.target.value = JSON.stringify(tableValue);
            table.___dispatchChange___(e);
        },


        render: function () {
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
                className: 'sort-button font-icon '
                    + (sortType === 'asc' ? 'font-icon-largeable-arrow-up' : 'font-icon-largeable-arrow-down'),
                style: {
                    display: sortEnable ? 'inline-block' : 'none',
                    color: sortField !== fieldConfig.field ? '#DEDEDE' : '#2F82F5'
                },
                onClick: this.onSortClick
            };
            var thProp = {
                className: 'th-header',
                textAlign: fieldConfig.align || 'left',
                verticalAlign: fieldConfig.verticalAlign || 'top'
            };
            return (
                <th {...thProp}>
                    <span>{fieldConfig.label}</span>
                    <Tip {...fieldConfig.tip}/>
                    <div {...sortButtonProp}></div>
                </th>
            );
        }
    });
});
