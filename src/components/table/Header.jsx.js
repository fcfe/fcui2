define(function (require) {

    var Tip = require('../../Tip.jsx');
    var React = require('react');

    return React.createClass({
        getDefaultProps: function () {
            return {
                onClick: function () {}
            };
        },
        sortHandler: function (e) {
            // 排序通过table的onChange传递出去
            var tableValue = this.props.tableValue || '{}';
            tableValue = JSON.parse(tableValue);
            tableValue.sortField = tableValue.sortField || '';
            tableValue.sortType = tableValue.sortType || 'asc';
            if (tableValue.sortField === this.props.field) {
                tableValue.sortType = tableValue.sortType === 'asc' ? 'desc' : 'asc';
            }
            else {
                tableValue.sortField = this.props.field;
                tableValue.sortType = 'desc';
            }
            e.target.value = JSON.stringify(tableValue);
            this.props.onClick(e);
        },
        render: function () {
            var sortEnable = this.props.tableFlags.sortEnable && !this.props.sortDisable;
            var tableValue = this.props.tableValue || '{}';
            tableValue = JSON.parse(tableValue);
            var sortField = tableValue.sortField || '';
            var sortType = tableValue.sortType || 'desc';
            if (sortField !== this.props.field) {
                sortType = 'desc'; //desc 降序 asc升序
            }
            var sortButtonProp = {
                className: 'sort-button font-icon '
                    + (sortType === 'asc' ? 'font-icon-largeable-arrow-up' : 'font-icon-largeable-arrow-down'),
                style: {
                    display: sortEnable ? 'inline-block' : 'none',
                    color: sortField !== this.props.field ? '#DEDEDE' : '#2F82F5'
                },
                onClick: this.sortHandler
            };
            return (
                <th className="th-header" style={{textAlign: this.props.align || 'left'}}>
                    <span>{this.props.label}</span>
                    <Tip {...this.props.tip}/>
                    <div {...sortButtonProp}></div>
                </th>
            );
        }
    });
});
