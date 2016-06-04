/**
 *  表格组件
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2
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
        // @override
        mixins: [InputWidget, WidgetWithFixedDom],
        // @override
        getDefaultProps: function () {
            return {
                // 样式属性
                skin: '',
                className: '',
                style: {},
                disabled: false,
                // 配置属性
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
                onAction: cTools.noop,
                // value模板, 此项目只能为基本类型，不能为object
                valueTemplate: JSON.stringify({
                    sortField: '',
                    sortType: 'asc',
                    selected: []    // 如果为全选，则此处为-1，否则，为行在datasource中的索引
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
            var width = isNaN(fields[i].width) ? 0 : fields[i].width * 1;
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
