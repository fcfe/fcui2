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
                    showMessage: false
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
        onRendered: function () {
            if (!this.refs || !this.refs.container) return;
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
            e.target = this.refs.container;
            e.target.value = JSON.stringify(tableValue);
            this.___dispatchChange___(e);
        },
        render: function () {
            if (!(this.props.fieldConfig instanceof Array) || !this.props.fieldConfig.length) return null;
            return (
                <div {...cTools.containerBaseProps('table', this)}>
                    <div ref="realTableContainer" className="table-container">
                        <table ref="table" cellSpacing="0" cellPadding="0">
                            {factory.colgroupFactory(this)}
                            <tbody ref="tbody">
                                {factory.headerFactory(this)}
                                {factory.messageFactory(this)}
                                {factory.summaryFactory(this)}
                                {factory.lineFactory(this)}
                            </tbody>
                        </table>
                    </div>
                    <div ref="shadowTableContainer" className="shadow-container">
                        <table ref="shadow" cellSpacing="0" cellPadding="0">
                            {factory.colgroupFactory(this)}
                            <tbody>
                                {factory.summaryFactory(this)}
                                {factory.lineFactory(this)}
                                {factory.headerFactory(this)}
                                {factory.messageFactory(this)}
                            </tbody>
                        </table>
                    </div>
                </div>
            );
        }
    });

});
