define(function (require) {


    var React = require('react');
    var InputWidgetBase = require('./mixins/InputWidgetBase');
    var tools = require('./core/tableTools.jsx');
    var language = require('./core/language');


    return React.createClass({
        // @override
        mixins: [InputWidgetBase],
        // @override
        getDefaultProps: function () {
            return {
                // 样式属性
                className: '',
                // 配置属性
                disable: false,
                fieldConfig: [],
                flags: {
                    sortAble: false,
                    showHeader: false,
                    showSummary: false,
                    showSelector: false
                },
                // 数据属性
                datasource: [],
                summary: {},
                message: {
                    content: '',
                    buttonLabel: language.button.fresh
                },
                fixedPosition: [
                    {ref: 'shadowTableContainer', top: 0, zIndex: 998}
                ],
                // 回调属性
                onAction: function () {},
                // value模板, 此项目只能为基本类型，不能为object
                valueTemplate: JSON.stringify({
                    sortField: '',
                    sortType: 'asc',
                    itemSelected: []         // 如果为全选，则此处为-1，否则，为行在datasource中的索引
                })
            };
        },
        // @override
        getInitialState: function () {
            return {};
        },
        // @override
        componentDidMount: function () {
            // window.addEventListener('scroll', this.scrollHandler);
            window.addEventListener('resize', this.updateWidth);
            this.updateWidth();
            // this.updateWidth();
            // this.recordFixedDOMPosition();
        },
        // @override
        componentWillUnmount: function () {
            // window.removeEventListener('scroll', this.scrollHandler);
            window.removeEventListener('resize', this.updateWidth);
        },
        // @override
        componentDidUpdate: function () {
            this.updateWidth();
        },
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


/*
rowSelected: function (e) {
    // var select = this.state.selectedIndex;
    // var items = [];
    // delete select[-1];
    // if (e === -3) { // -3 取消当前所有选中，没有时间写常量了
    //     select = {};
    // }
    // else if (e === -1 || e === -2) { // -1 全部选中；-2 选中当前页；没有时间写常量了
    //     if (e === -1) select[-1] = true;
    //     for (var i = 0; i < this.props.datasource.length; i++) select[i] = true;
    // }
    // else {
    //     var value = e.target.checked;
    //     var id = parseInt(util.getDataset(e.target).uiCmd);
    //     if (value) {
    //         select[id] = true;
    //     }
    //     else {
    //         delete select[id];
    //     }
    // }
    // if (select[-1]) {
    //     items = -1;
    // }
    // else {
    //     for (var key in select) {
    //         if (select.hasOwnProperty(key)) items.push(parseInt(key, 10));
    //     }
    //     items.sort();
    //     for (var i = 0; i < items.length; i++) {
    //         items[i] = this.props.datasource[items[i]];
    //     }
    // }
    // this.setState({selectedIndex: select, selectedItems: items});
    // this.props.onAction('TableSelect', {items: items});
}
*/