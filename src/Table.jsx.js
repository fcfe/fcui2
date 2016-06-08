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
    var TableMessage = require('./components/table/MessageBar.jsx');
    var TableHeader = require('./components/table/NormalHeader.jsx');
    var NormalRenderer = require('./components/table/NormalRenderer.jsx');
    var Others = {
        selectorHeader: require('./components/table/SelectorInHeader.jsx'),
        selectorItem: require('./components/table/SelectorInTBody.jsx')
    };


    var cTools = require('./core/componentTools');
    var tools = require('./core/tableTools');    
    var util = require('./core/util');
    var language = require('./core/language');
    

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
         * @param {Boolean} flags.showSummary 是否在表头下方显示汇总栏，默认false
         * @param {Boolean} flags.showSelector 是否在第一列显示行选择器，默认false，不建议使用，改在fieldConfig中添加。
         *      此属性改为配置选择器工作模式：false|0 关闭；true|1 开启；2 选择当前页；3 选择全部
         * @param {Array.<Object>} datasource 表格数据源
         * @param {Object} summary 表格汇总信息的数据源
         * @param {Object} message 表格信息栏的数据源
         * @param {String} message.content 信息栏中显示的信息，不制定，信息栏将不会显示
         * @param {String} message.buttonLabel 信息栏中紧随信息文本的按钮标签，点击此按钮会通过onAction回调TableMessageBarClick事件
         * @param {Array.<TableFixedObject>} fixedPosition 当body滚动条发生滚动事，满足条件后位置固定的元素配置信息
         * @param {Function} onAction 表格内部子渲染器的回调接口
         *
         * @param {Import|Properties} src\mixins\InputWidget.js
         *      value onChange name validations customErrorTemplates valueLink valueTemplate
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
         *      isEmptyHeader: <optional>
         *      thRenderer: <optional>
         *      prepare: function (tdRendererProps, dataItem, rowIndex, columnIndex, tableComponent) <optional>
         *  }
         *
         * @attention TableFieldObject中，除function类型的值，其他数据都会无条件灌入renderer中，
         *      以下属性除外：item, row, column, key, onAction
         *
         * @param {Boolean} isSelector 该列是否是选择器，如果为true，其他配置均无效
         * @param {String} label 显示在表头的列名
         * @param {String} field 列名称
         * @param {String | Function} content 列显示的数据域或域处理函数；如果为字符串，则此处会被替换为dataItem[content]
         *      如果是函数，此处将被替换函数的返回值
         * @param {ReactClass} renderer 列单元格渲染器
         * @param {Boolean} isEmptyHeader 表头是否留空，如果为true，则thRenderer无效
         * @param {ReactClass} thRenderer 列表头渲染器
         * @param {Function} prepare 单元格渲染前，生成的props属性集以及一些其他参数会以指针形式调用此回调，在这个回调中，
         *      可以对props做任意修改
         * @param {Any} width,align,verticalAlign,color 将要被下降到tdRendererProps.style中的属性
         */
        /**
         * @structure TableFixedObject
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
         *  }
         * @attention table的value类型是字符串，用JSON.stringify方法将示例中的数据结构转换，因此操作value时不能出环
         * @param {String} sortField table当前排序的列名
         * @param {String} sortType table当前排序的类型
         * @param {Array.<Number> | Number} selected table当前选中的元素的行号集合，如果此项为-1，则标识table被全选
         */
        // @override
        propTypes: {
            // base
            skin: React.PropTypes.string,
            className: React.PropTypes.string,
            style: React.PropTypes.object,
            disabled: React.PropTypes.bool,
            // self
            fieldConfig: React.PropTypes.array,
            flags: React.PropTypes.object,
            datasource: React.PropTypes.array,
            summary: React.PropTypes.object,
            message: React.PropTypes.object,
            fixedPosition: React.PropTypes.array,
            onAction: React.PropTypes.func,
            // mixin
            value: React.PropTypes.string,
            valueLink: React.PropTypes.object,
            name: React.PropTypes.string,
            onChange: React.PropTypes.func,
            validations: React.PropTypes.object,
            customErrorTemplates: React.PropTypes.object,
            valueTemplate: React.PropTypes.string
        },
        // @override
        mixins: [InputWidget, WidgetWithFixedDom],
        // @override
        getDefaultProps: function () {
            return {
                skin: '',
                className: '',
                style: {},
                disabled: false,
                fieldConfig: [],
                flags: {
                    sortEnable: false,
                    showHeader: false,
                    showSummary: false,
                    showSelector: false
                },
                datasource: [],
                summary: {},
                message: {
                    content: '',
                    buttonLabel: language.button.fresh
                },
                fixedPosition: [],
                onAction: cTools.noop,
                valueTemplate: JSON.stringify({
                    sortField: '',
                    sortType: 'asc',
                    selected: []
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
            return (
                <div {...cTools.containerBaseProps('table', this)}>
                    <div ref="realTableContainer" className="table-container">
                        <table ref="table" cellSpacing="0" cellPadding="0">
                            {colgroupFactory(this)}
                            <tbody ref="tbody">
                                {headerFactory(this)}
                                {messageFactory(this)}
                                {summaryFactory(this)}
                                {lineFactory(this)}
                            </tbody>
                        </table>
                    </div>
                    <div ref="shadowTableContainer" className="shadow-container">
                        <table ref="shadow" cellSpacing="0" cellPadding="0">
                            {colgroupFactory(this)}
                            <tbody>
                                {summaryFactory(this)}
                                {lineFactory(this)}
                                {headerFactory(this)}
                                {messageFactory(this)}
                            </tbody>
                        </table>
                    </div>
                </div>
            );
        }
    });
    
    
    // 生成列宽度
    function colgroupFactory(me) {
        var td = [];
        var fields = tools.fieldConfigFactory(me, Others);
        for (var i = 0; i < fields.length; i++) {
            var width = cTools.getValueFromPropsAndStyle(fields[i], 'width', 0);
            td.push(<col style={{width: width + 'px'}} key={'colgroup-' + i} />);
        }
        return <colgroup>{td}</colgroup>
    }


    // 生成表头
    function headerFactory(me) {
        if (!me.props.flags || !me.props.flags.showHeader || !tools.haveDate(me)) return null;
        var td = [];
        var fields = tools.fieldConfigFactory(me, Others);
        for (var i = 0; i < fields.length; i++) {
            if (fields[i].isEmptyHeader) {
                td.push(<th className="th-header" key={'header-' + i}></th>);
                continue;
            }
            var Renderer = typeof fields[i].thRenderer === 'function' ? fields[i].thRenderer : TableHeader;
            var props = {
                fieldConfig: fields[i],
                tableComponent: me,
                key: 'header-' + i
            };
            td.push(<Renderer {...props} />);
        }
        return <tr className="tr-header" key="tr-header">{td}</tr>;
    }


    // 生成统计栏
    function summaryFactory(me) {
        if (!me.props.flags || !me.props.flags.showSummary || !tools.haveDate(me)) {
            return null;
        }
        var td = [];
        var fields = tools.fieldConfigFactory(me, Others);
        var summary = me.props.summary;
        for (var i = 0; i < fields.length; i++) {
            var item = fields[i];
            var tdStyle = {};
            var text = !item.hasOwnProperty('field')
                ? '' : (summary.hasOwnProperty(item.field) ? summary[item.field] : '-');
            text = fields[i].isSelector ? '' : text;
            tdStyle.textAlign = item.align || 'left';
            td.push(<td style={tdStyle} key={'summary-' + i}>{text}</td>);
        }
        return <tr className="tr-summary" key="tr-summray">{td}</tr>;
    }


    // 生成message栏
    function messageFactory(me) {
        if (!me.props.flags || !me.props.flags.showMessage || !tools.haveDate(me)) {
            return null;
        }
        var fields = tools.fieldConfigFactory(me, Others);
        var prop = {
            message: me.props.message && me.props.message.content ? me.props.message.content : '',
            buttonLabel: me.props.message && me.props.message.buttonLabel ? me.props.message.buttonLabel : '',
            onClick: me.props.onAction,
            colSpan: fields.length + 10
        };
        return (<TableMessage {...prop}/>);
    }


    // 生成行
    function lineFactory(me) {
        var lines = [];
        var config = tools.fieldConfigFactory(me, Others);;
        var datasource = me.props.datasource instanceof Array ? me.props.datasource : [];
        // 没有数据源
        if (!tools.haveDate(me)) {
            return (
                <tr>
                    <td colSpan={config.length + 10} style={{textAlign: 'center'}}>
                        <div className="table-nodata">{language.table.noData}</div>
                    </td>
                </tr>
            );
        }
        // 获取表格当前值，并制作选中行的hash
        var selectedHash = tools.getSelected(me.___getValue___());
        // 渲染行
        for (var index = 0; index < datasource.length; index++) {
            var td = [];
            var item = datasource[index];
            var selected = selectedHash === -1 || selectedHash[index];
            var trProp = {
                key: 'row-' + index,
                className: selected ? 'tr-data tr-selected' : 'tr-data'
            };
            for (var j = 0; j < config.length; j++) {
                var props = tools.tdPropsFactory(config[j], item, me, index, j);
                var Renderer = typeof config[j].renderer === 'function' ? config[j].renderer : NormalRenderer;
                props.___isRowSelected___ = selected;
                td.push(<Renderer {...props} />);
            }
            lines.push(<tr {...trProp}>{td}</tr>);
        }
        return lines;
    }
});
