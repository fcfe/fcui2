/**
 * @file 表格组件
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.1
 */
define(function (require) {


    var React = require('react');
    var tools = require('./core/tableTools.jsx');
    var language = require('./core/language');
    var util = require('./core/util');
    var InputWidget = require('./mixins/InputWidget');
    var WidgetWithFixedDom = require('./mixins/WidgetWithFixedDom');


    return React.createClass({
        // @override
        mixins: [InputWidget, WidgetWithFixedDom],
        // @override
        getDefaultProps: function () {
            return {
                // 样式属性
                className: '',
                // 配置属性
                disabled: false,
                fieldConfig: [],
                flags: {
                    sortEnable: false,
                    showHeader: false,
                    showSummary: false,
                    showSelector: false // false | 0: 关闭；true | 1: 开启；2：选择当前页；3：选择全部
                },
                // 数据属性
                datasource: [],
                summary: {},
                message: {
                    content: '',
                    buttonLabel: language.button.fresh
                },
                fixedPosition: [],  // {ref: 'shadowTableContainer', top: 0, zIndex: 998}
                // 回调属性
                onAction: function () {},
                // value模板, 此项目只能为基本类型，不能为object
                valueTemplate: JSON.stringify({
                    sortField: '',
                    sortType: 'asc',
                    selected: []         // 如果为全选，则此处为-1，否则，为行在datasource中的索引
                })
            };
        },
        // @override
        getInitialState: function () {
            return {};
        },
        // @override
        componentDidMount: function () {
            window.addEventListener('resize', this.updateWidth);
            this.updateWidth();
        },
        // @override
        componentWillUnmount: function () {
            window.removeEventListener('resize', this.updateWidth);
        },
        // @override
        componentDidUpdate: function () {
            this.updateWidth();
        },
        /**
         * 同步main table和shadow table的宽度，重新设置shadow container高度
         */
        updateWidth: function () {
            var width = this.refs.container.offsetWidth;
            var table = this.refs.table;
            var shadow = this.refs.shadow;
            var tbody = this.refs.tbody;
            var shadowContainer = this.refs.shadowTableContainer;
            var height = 0;
            table.style.maxWidth = shadow.style.maxWidth = width + 'px';
            table.style.minWidth = shadow.style.minWidth = width + 'px';
            for (var i = 0; i < tbody.childNodes.length; i++) {
                var tr = tbody.childNodes[i];
                if (tr.className.indexOf('tr-data') > -1 || tr.className.indexOf('tr-summary') > -1) continue;
                height += tr.offsetHeight;
            }
            shadowContainer.style.height = height + 'px';
        },
        /**
         * 将value中的selected域转成hash并返回
         */
        getSelectedHash: function () {
            var value = this.___getValue___();
            value = typeof value === 'string' ? JSON.parse(value) : {};
            var selected = {};
            if (value.selected === -1) {
                selected = -1;
            }
            else if (value.selected instanceof Array) {
                for (var s = 0; s < value.selected.length; s++) selected[value.selected[s]] = true;
            }
            return selected;
        },
        /**
         * 选中某行
         */
        rowSelect: function (e) {
            if (this.props.disabled) return;
            var dataset = util.getDataset(e.target);
            var index = parseInt(dataset.uiCmd, 10);
            var value = e.target.checked;
            var menuValue = e.target.value;
            var selected = this.getSelectedHash();
            var newSelected = [];
            // 全选取消一项
            if (selected === -1 && !value) {
                for (var i = 0; i < this.props.datasource.length; i++) {
                    if (i === index) continue;
                    newSelected.push(i);
                }
            }
            // 选中
            else if (selected !== -1 && value) {
                selected[index] = true;
                for (var i = 0; i < this.props.datasource.length; i++) {
                    if (!selected[i]) continue;
                    newSelected.push(i);
                }
            }
            // 取消选中
            else if (selected !== -1 && !value) {
                selected[index] = false;
                for (var i = 0; i < this.props.datasource.length; i++) {
                    if (!selected[i]) continue;
                    newSelected.push(i);
                }
            }
            // 全部选中
            if (menuValue === '-1') {
                newSelected = -1;
            }
            // 选中当前页
            else if (menuValue === '-2') {
                newSelected = [];
                for (var i = 0; i < this.props.datasource.length; i++) newSelected.push(i);
            }
            // 取消所有选中
            else if (menuValue === '-3') {
                newSelected = [];
            }
            // 重新组装value
            var tableValue = this.___getValue___() || '{}';
            tableValue = JSON.parse(tableValue);
            tableValue.selected = newSelected;
            e.target = this.refs.container;
            e.target.value = JSON.stringify(tableValue);
            this.___dispatchChange___(e);
        },
        // @override
        render: function () {
            return (
                <div className={'fcui2-table ' + this.props.className} ref="container">
                    <div ref="realTableContainer" className="table-container">
                        <table ref="table" cellSpacing="0" cellPadding="0">
                            {tools.colgroupFactory(this)}
                            <tbody ref="tbody">
                                {tools.headerFactory(this)}
                                {tools.messageFactory(this)}
                                {tools.summaryFactory(this)}
                                {tools.lineFactory(this)}
                            </tbody>
                        </table>
                    </div>
                    <div ref="shadowTableContainer" className="shadow-container">
                        <table ref="shadow" cellSpacing="0" cellPadding="0">
                            {tools.colgroupFactory(this)}
                            <tbody>
                                {tools.summaryFactory(this)}
                                {tools.lineFactory(this)}
                                {tools.headerFactory(this)}
                                {tools.messageFactory(this)}
                            </tbody>
                        </table>
                    </div>
                </div>
            );
        }
    });
});
