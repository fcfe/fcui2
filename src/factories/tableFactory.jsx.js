
define(function (require) {

    var _ = require('underscore');
    var React = require('react');
    var TableMessage = require('../components/table/MessageBar.jsx');
    var TableHeader = require('../components/table/NormalHeader.jsx');
    var NormalRenderer = require('../components/table/NormalRenderer.jsx');
    var NoDataRenderer = require('../components/table/NoDataRenderer.jsx');
    var Others = {
        selectorHeader: require('../components/table/SelectorInHeader.jsx'),
        selectorItem: require('../components/table/SelectorInTBody.jsx')
    };
    var cTools = require('../core/componentTools');
    var tools = require('../core/tableTools');

    return {

        // 生成列宽度
        colgroupFactory: function (me) {
            var td = [];
            var fields = tools.fieldConfigFactory(me, Others);
            for (var i = 0; i < fields.length; i++) {
                var width = cTools.getValueFromPropsAndStyle(fields[i], 'width', 0);
                td.push(<col style={{width: width + 'px', maxWidth: width + 'px'}} key={'colgroup-' + i} />);
            }
            return <colgroup>{td}</colgroup>
        },

        // 生成表头
        headerFactory: function (me) {
            if (!me.props.flags || !me.props.flags.showHeader) return null;
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
        },

        // 生成统计栏
        summaryFactory: function (me) {
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
        },

        // 生成message栏
        messageFactory: function (me) {
            if (!me.props.flags || !me.props.flags.showMessage || !tools.haveDate(me)) {
                return null;
            }
            var fields = tools.fieldConfigFactory(me, Others);
            var messageConfig = _.extend({}, me.props.message);
            var Message = typeof messageConfig.renderer === 'function' ? messageConfig.renderer : TableMessage;
            delete messageConfig.renderer;
            return (<Message {...messageConfig} onAction={me.props.onAction} colSpan={fields.length}/>);
        },

        // 生成行
        lineFactory: function (me, isShadow) {
            var lines = [];
            var config = tools.fieldConfigFactory(me, Others);;
            var datasource = me.props.datasource instanceof Array ? me.props.datasource : [];
            // 没有数据源
            if (!tools.haveDate(me)) {
                var NoData = typeof me.props.noDataRenderer === 'function' ? me.props.noDataRenderer : NoDataRenderer;
                return (
                    <tr className="tr-data tr-nodata">
                        <td colSpan={config.length} style={{textAlign: 'center'}}>
                            <NoData tableComponent={me}/>
                        </td>
                    </tr>
                );
            }
            // 渲染行
            for (var index = 0; index < datasource.length; index++) {
                // 影子没必要所有行全显示，只显示一部分行就差不多了。出现对不起的情况几率会大大降低，并且提高性能
                if (isShadow && index % 3 !== 0) continue;
                var td = [];
                var item = datasource[index];
                var selectState = tools.getRowSelectedState(index, me.___getValue___());
                var trProp = {
                    key: 'row-' + index,
                    className: selectState === 0 ? 'tr-data tr-selected' : 'tr-data'
                };
                for (var j = 0; j < config.length; j++) {
                    var props = tools.tdPropsFactory(config[j], item, me, index, j);
                    var Renderer = typeof config[j].renderer === 'function' ? config[j].renderer : NormalRenderer;
                    props.___isRowSelected___ = selectState;
                    td.push(<Renderer {...props} />);
                }
                lines.push(<tr {...trProp}>{td}</tr>);
            }
            return lines;
        }
    };

});
