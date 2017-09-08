/**
 * 表格
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2.1
 */
define(function (require) {


    var React = require('react');
    var InputWidget = require('./mixins/InputWidget');
    var WidgetWithFixedDom = require('./mixins/WidgetWithFixedDom');
    var NoDataRenderer = require('./components/table/NoDataRenderer.jsx');


    var cTools = require('./core/componentTools');
    var tools = require('./core/tableTools');
    var util = require('./core/util');
    var language = require('./core/language');
    var factory = require('./factories/tableFactory.jsx');


    return React.createClass({
        /**
         * @properties
         *
         * @param {Import|Properties} src\core\componentTools.js skin className style disabled
         *
         * @param {Array.<TableFieldObject>} fieldConfig 表格列配置
         * @param {Object} flags 表格附属功能开关集合
         * @param {Boolean} flags.sortEnable 是否显示排序按钮，默认false
         * @param {Boolean} flags.showHeader 是否显示表头，默认false
         * @param {Boolean} flags.showMessage 是否显示通知栏
         * @param {Boolean} flags.showSummary 是否在表头下方显示汇总栏，默认false
         * @param {Boolean} flags.showGroupNameInHeader 是否在表头显示列的分组名称，默认false
         * @param {Boolean} flags.showHorizontalScroll 是否显示横向滚动条。
         * 若开启此功能，表格左侧连续设定为fxied的列，不随横向滚动条滚动，永远固定在左侧。
         * @param {Boolean} flags.showSelector 是否在第一列显示行选择器，默认false，不建议使用，改在fieldConfig中添加。此属性改为配置选择器工作模式：
         *   false|0: 关闭
         *    true|1: 开启
         *         2: 只选择当前页
         *         3: 只选择全部
         * @param {Array.<Object>} datasource 表格数据源
         * @param {Object} summary 表格汇总信息的数据源
         * @param {Object} message 表格信息栏的数据源
         * @param {String} message.content 信息栏中显示的信息，不制定，信息栏将不会显示
         * @param {String} message.buttonLabel 信息栏中紧随信息文本的按钮标签，点击此按钮会通过onAction回调TableMessageBarClick事件
         * @param {Array.<FixedObject>} fixedPosition 当body滚动条发生滚动事，满足条件后位置固定的元素配置信息
         * @param {ReactClass} noDataRenderer 表格无数据时的渲染器
         * @param {Function} onAction 表格控制回调总线
         *
         * @param {Import|Properties} src\mixins\InputWidget.js
         *      value onChange name validations customErrorTemplates valueTemplate
         */
        /**
         * @structure TableFieldObject
         * @example
         *  {
         *      isSelector: <optional>
         *      label: <optional>
         *      field: <optional>
         *      content: function (dataItem, rowIndex, columnIndex, tableComponent)) <optional>
         *      renderer: <optional>
         *      disabled: <optional>
         *      groupName: <optional>
         *      isEmptyHeader: <optional>
         *      thRenderer: <optional>
         *      prepare: function (tdRendererProps, dataItem, rowIndex, columnIndex, tableComponent) <optional>
         *  }
         *
         * @attention TableFieldObject中，除function类型的值，其他数据都会无条件灌入renderer中，
         * 以下属性除外：item, row, column, key, onAction
         *
         * @param {Boolean} isSelector 该列是否是选择器，如果为true，其他配置除width外均无效
         * @param {String} label 显示在表头的列名
         * @param {String} field 域名称，如果不设置content属性，会根据此属性最终content的值
         * @param {String|Function} content 列显示的数据域或域处理函数；如果为字符串，则此处会被替换为dataItem[content]。如果是函数，此处将被替换函数的返回值。
         * @param {ReactClass} renderer 列单元格渲染器
         * @param {Boolean} disabled 该列是否禁用
         * @param {Boolean} groupName 该列的分组名称
         * @param {Boolean} isEmptyHeader 表头是否留空，如果为true，则thRenderer无效
         * @param {ReactClass} thRenderer 列表头渲染器
         * @param {Function} prepare 单元格renderer渲染前，生成的props属性集以及一些其他参数会以指针形式调用此回调。
         * 在这个回调中，可以对props做任意修改。
         * function prepare(props, item, row, column, me) {}
         *      props   {Object} 用于渲染单元格的属性集
         *      item    {Object} 单元格所在行的数据源
         *      row     {Number} 单元格行号
         *      column  {Number} 单元格所在列号
         *      me      {ReactComponent} 表格组件实例
         */
        /**
         * @structure FixedObject
         * @example
         *  {
         *      ref: <required>
         *      top: <required>
         *      zIndex: <optional>
         *  }
         * @param {String} ref 将被固定的dom的ref属性值
         * @param {Number} top 当dom在屏幕中的显示位置，上边框到window顶部（注意不是body顶部）距离小于top时，将被固定
         * @param {Number} zIndex 如果有多个dom要被固定，zIndex用来约束他们的层次顺序
         */
        /**
         * @structure TableValueTemplate
         * @example
         *  {
         *      sortField: <optional>
         *      sortType: <optional>
         *      selected: <optional>
         *      indeterminate: <optional>
         *  }
         * @attention table的value类型是字符串，用JSON.stringify方法将示例中的数据结构转换，因此操作value时不能出环
         * @param {String} sortField table当前排序的列名
         * @param {String} sortType table当前排序的类型
         * @param {Array.<Number> | Number} selected table当前选中的元素的行号集合，如果此项为-1，则标识table被全选
         * @param {Array.<Number>} indeterminate table当前处于半选状态的行
         */
        /**
         * @fire Import src\mixins\InputWidget.js XXX onChange
         */
        /**
         * @fire table onAction
         * @param {String} style 回调类型
         * @param {Object} param 回调参数
         */
        // @override
        contextTypes: {
            appSkin: React.PropTypes.string
        },
        // @override
        mixins: [InputWidget, WidgetWithFixedDom],
        // @override
        getDefaultProps: function () {
            return {
                // base
                skin: '',
                className: '',
                style: {},
                disabled: false,
                // self
                fieldConfig: [],
                flags: {
                    sortEnable: false,
                    showHeader: false,
                    showSummary: false,
                    showSelector: false,
                    showMessage: false,
                    showGroupNameInHeader: false
                },
                datasource: [],
                summary: {},
                message: {
                    content: '',
                    buttonLabel: language.button.fresh
                },
                fixedPosition: [],
                noDataRenderer: NoDataRenderer,
                onAction: cTools.noop,
                // mixin
                valueTemplate: JSON.stringify({
                    sortField: '',
                    sortType: 'asc',
                    selected: [],
                    indeterminate: []
                })
            };
        },
        // @override
        getInitialState: function () {
            return {};
        },
        // @override
        componentDidMount: function () {
            window.addEventListener('resize', this.onRendered);
            this.onRendered();
        },
        // @override
        componentWillUnmount: function () {
            window.removeEventListener('resize', this.onRendered);
        },
        // @override
        componentDidUpdate: function () {
            this.onRendered();
        },
        onHorizontalScroll: function () {
            if (!this.refs || !this.refs.normalFieldsScrollContainer) return;
            this.refs.normalFieldsScrollContainer.scrollLeft = this.refs.shadowNormalFieldsScrollContainer.scrollLeft;
        },
        onHorizontalScroll1: function (e) {
            if (!this.refs || !this.refs.normalFieldsScrollContainer) return;
            this.refs.normalFieldsScrollContainer.scrollLeft += e.nativeEvent.deltaX;
            this.refs.shadowNormalFieldsScrollContainer.scrollLeft += e.nativeEvent.deltaX;
        },
        onRendered: function () {
            if (!this.refs || !this.refs.container) return;

            var container = this.refs.container;
            var shadowTableContainer = this.refs.shadowTableContainer;
            var realTableContainer = this.refs.realTableContainer;
            var table = this.refs.table;
            var shadowTable = this.refs.shadowTable;
            var normalFieldsScrollContainer = this.refs.normalFieldsScrollContainer;
            var normalFieldsContainer = this.refs.normalFieldsContainer;
            var fixedFieldsContainer = this.refs.fixedFieldsContainer;
            var fixedTable = this.refs.fixedTable;
            var shadowNormalFieldsScrollContainer = this.refs.shadowNormalFieldsScrollContainer;
            var shadowNormalFieldsContainer = this.refs.shadowNormalFieldsContainer;
            var shadowFixedFieldsContainer = this.refs.shadowFixedFieldsContainer;
            var shadowFixedTable = this.refs.shadowFixedTable;
            var shadowMessageBar = this.refs.shadowMessageBar;

            var componentWidth = container.offsetWidth;
            // 修正table区域各种尺寸
            if (shadowNormalFieldsScrollContainer) {
                // 展开table，修正右侧table尺寸
                normalFieldsContainer.style.width = '9999px';
                if (table.offsetWidth < componentWidth) {
                    fixedTable.style.minWidth = table.style.minWidth = componentWidth + 'px';
                }
                fixedTable.style.width = table.offsetWidth + 'px';
                // 修正各容器尺寸和外边距
                var fixedWidth = getFixedFieldsWidth(this) + 1;
                normalFieldsScrollContainer.style.marginLeft = fixedFieldsContainer.style.width = fixedWidth + 'px';
                table.style.marginLeft = (-fixedWidth) + 'px';
                normalFieldsContainer.style.width = (table.offsetWidth - fixedWidth) + 'px';
                // 修正表头宽度
                shadowFixedTable.style.width = table.offsetWidth + 'px';
                shadowFixedFieldsContainer.style.width = fixedWidth + 'px';
                shadowTable.style.width = table.offsetWidth + 'px';
                shadowTable.style.marginLeft = (-fixedWidth) + 'px'; 
                shadowNormalFieldsScrollContainer.style.left = fixedWidth + 'px';
                shadowNormalFieldsScrollContainer.style.width = normalFieldsScrollContainer.offsetWidth + 'px';
            }
            else {
                table.style.maxWidth
                    = shadowTable.style.maxWidth
                    = table.style.minWidth
                    = shadowTable.style.minWidth
                    = componentWidth + 'px';
            }
            // 修正表头尺寸
            shadowTableContainer.style.width = componentWidth + 'px';
            if (shadowNormalFieldsScrollContainer) {
                var dataAreaHeight = getTableDataAreaHeight(this.refs.tbody);
                shadowMessageBar.style.width = componentWidth + 'px';
                shadowFixedFieldsContainer.style.top = -dataAreaHeight + 'px';
                shadowNormalFieldsScrollContainer.style.top = -dataAreaHeight + 'px';
                shadowTableContainer.style.height =
                    shadowNormalFieldsScrollContainer.offsetHeight
                    - dataAreaHeight
                    + shadowMessageBar.offsetHeight - 1
                    + 'px';
                container.style.paddingTop =
                    shadowNormalFieldsScrollContainer.offsetHeight
                    - dataAreaHeight
                    - getTableHeaderHeight(this.refs.tbody)
                    + 'px';
            }
            else {
                shadowTableContainer.style.height = getTableHeaderHeight(this.refs.tbody, true) +'px';
            }
        },
        onRowSelect: function (e) {
            if (this.props.disabled) return;
            var tableValue = this.___getValue___() || '{}';
            tableValue = JSON.parse(tableValue);
            tableValue.selected = tools.updateSelected(
                parseInt(util.getDataset(e.target).uiCmd || e.target.value, 10),
                e.target.checked,
                e.target.value,
                this.___getValue___(),
                this.props.datasource
            );
            e = {target: this.refs.container};
            e.target.value = JSON.stringify(tableValue);
            this.___dispatchChange___(e);
        },
        render: function () {
            if (!(this.props.fieldConfig instanceof Array) || !this.props.fieldConfig.length) return null;
            var flags = this.props.flags || {};
            return flags.showHorizontalScroll ? hScrollRenderer(this) : normalRenderer(this);
        }
    });


    function normalRenderer(me) {
        return (
            <div {...cTools.containerBaseProps('table', me)}>
                <div ref="realTableContainer" className="table-container">
                    <table ref="table" cellSpacing="0" cellPadding="0">
                        {factory.colgroupFactory(me)}
                        <tbody>
                            {factory.headerFactory(me)}
                            {factory.messageFactory(me)}
                            {factory.summaryFactory(me)}
                            {factory.lineFactory(me)}
                        </tbody>
                    </table>
                </div>
                <div ref="shadowTableContainer" className="shadow-container">
                    <table ref="shadowTable" cellSpacing="0" cellPadding="0">
                        {factory.colgroupFactory(me)}
                        <tbody ref="tbody">
                            {factory.summaryFactory(me)}
                            {factory.lineFactory(me)}
                            {factory.headerFactory(me)}
                            {factory.messageFactory(me)}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }


    function hScrollRenderer(me) {
        var shadowNormalFieldsScrollContainerProps = {
            ref: 'shadowNormalFieldsScrollContainer',
            className: 'horizontal-scroll-container',
            onScroll: me.onHorizontalScroll
        };
        var normalFieldsScrollContainerProps = {
            ref: 'normalFieldsScrollContainer',
            className: 'horizontal-scroll-container',
            onWheel: me.onHorizontalScroll1
        };
        return (
            <div {...cTools.containerBaseProps('table', me)}>
                <div ref="realTableContainer" className="table-container">
                    <div ref="fixedFieldsContainer" className="fixed-fields-container">
                        <table ref="fixedTable" cellSpacing="0" cellPadding="0">
                            {factory.colgroupFactory(me)}
                            <tbody>
                                {factory.headerFactory(me)}
                                {factory.messageFactory(me)}
                                {factory.summaryFactory(me)}
                                {factory.lineFactory(me)}
                            </tbody>
                        </table>
                    </div>
                    <div {...normalFieldsScrollContainerProps}>
                        <div ref="normalFieldsContainer">
                            <table ref="table" cellSpacing="0" cellPadding="0">
                                {factory.colgroupFactory(me)}
                                <tbody ref="readTbody">
                                    {factory.headerFactory(me)}
                                    {factory.messageFactory(me)}
                                    {factory.summaryFactory(me)}
                                    {factory.lineFactory(me)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div ref="shadowTableContainer" className="shadow-container-with-scroll">
                    <div ref="shadowFixedFieldsContainer" className="fixed-fields-container">
                        <table ref="shadowFixedTable" cellSpacing="0" cellPadding="0">
                            {factory.colgroupFactory(me)}
                            <tbody>
                                {factory.lineFactory(me)}
                                {factory.headerFactory(me)}
                            </tbody>
                        </table>
                    </div>
                    <div {...shadowNormalFieldsScrollContainerProps}>
                        <div ref="shadowNormalFieldsContainer">
                            <table ref="shadowTable" cellSpacing="0" cellPadding="0">
                                {factory.colgroupFactory(me)}
                                <tbody ref="tbody">
                                    {factory.lineFactory(me)}
                                    {factory.headerFactory(me)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="message-bar-in-scrolling-header" ref="shadowMessageBar">
                        <table cellSpacing="0" cellPadding="0">
                            <tbody>
                                {factory.messageFactory(me)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }


    function getFixedFieldsWidth(me) {
        if (!me.refs || !me.refs.readTbody) return 0;
        var fields = tools.fieldConfigFactory(me, {});
        var tbody = me.refs.readTbody;
        if (!tbody.childNodes.length) return 0;
        var tr = tbody.childNodes[0];
        if (tr.childNodes.length !== fields.length) return 0;
        var result = 0;
        var breaked = false;
        fields.map(function (item, index) {
            result += !breaked && item.fixed ? tr.childNodes[index].offsetWidth : 0;
            breaked = !item.fixed ? true : breaked;
        });
        return result;
    }


    function getTableDataAreaHeight(tbody) {
        var result = 0;
        for (var i = 0; i < tbody.childNodes.length; i++) {
            var tr = tbody.childNodes[i];
            if (!tr.tagName) continue;
            result += tr.className.indexOf('tr-data') > -1 || tr.className.indexOf('tr-summary') > -1
                ? tr.offsetHeight : 0;
        }
        return result;
    }


    function getTableHeaderHeight(tbody, includeMessageBar) {
        var result = 0;
        for (var i = 0; i < tbody.childNodes.length; i++) {
            var tr = tbody.childNodes[i];
            if (!tr.tagName) continue;
            result += tr.className.indexOf('tr-header') > -1 || (includeMessageBar && tr.className.indexOf('tr-message') > -1) ? tr.offsetHeight : 0;
        }
        return result;
    }

});
