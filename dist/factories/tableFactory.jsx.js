var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

define(function (require) {

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
    var util = require('../core/util');

    return {

        // 生成列宽度
        colgroupFactory: function colgroupFactory(me) {
            var td = [];
            var fields = tools.fieldConfigFactory(me, Others);
            for (var i = 0; i < fields.length; i++) {
                var width = cTools.getValueFromPropsAndStyle(fields[i], 'width', 0);
                td.push(React.createElement('col', { style: { width: width + 'px', maxWidth: width + 'px' }, key: 'colgroup-' + i }));
            }
            return React.createElement(
                'colgroup',
                null,
                td
            );
        },

        // 生成表头
        headerFactory: function headerFactory(me) {
            if (!me.props.flags || !me.props.flags.showHeader) return null;
            var fields = tools.fieldConfigFactory(me, Others);
            if (me.props.flags.showGroupNameInHeader) {
                var td1 = [];
                var td2 = [];
                var lastGroupName = '';
                for (var i = 0; i < fields.length; i++) {
                    var field = fields[i];
                    if (typeof field.groupName === 'string' && field.groupName.length) {
                        if (field.groupName === lastGroupName) {
                            td1[td1.length - 1].colspan += 1;
                        } else {
                            td1.push({ groupName: field.groupName, colspan: 1 });
                            lastGroupName = field.groupName;
                        }
                        td2.push({ index: i });
                    } else {
                        td1.push({ index: i });
                    }
                }
                td1 = td1.map(function (item, index) {
                    if (item.hasOwnProperty('index')) {
                        return getHeadDom(fields[item.index], item.index, null, 2);
                    } else {
                        return React.createElement(
                            'th',
                            { className: 'tr-header-groupname', colSpan: item.colspan, key: 'group-name-' + index },
                            item.groupName
                        );
                    }
                });
                td2 = td2.map(function (item) {
                    return getHeadDom(fields[item.index], item.index);
                });
                var result = [];
                td1.length && result.push(React.createElement(
                    'tr',
                    { className: 'tr-header', key: 'tr-header-1' },
                    td1
                ));
                td2.length && result.push(React.createElement(
                    'tr',
                    { className: 'tr-header', key: 'tr-header-2' },
                    td2
                ));
                return result;
            } else {
                return React.createElement(
                    'tr',
                    { className: 'tr-header', key: 'tr-header' },
                    fields.map(getHeadDom)
                );
            }
            function getHeadDom(field, i, arr, rowspan) {
                if (field.isEmptyHeader) {
                    return React.createElement('th', { className: 'th-header', key: 'header-' + i, rowspan: rowspan });
                }
                var Renderer = typeof field.thRenderer === 'function' ? field.thRenderer : TableHeader;
                var props = {
                    fieldConfig: field,
                    tableComponent: me,
                    key: 'header-' + i,
                    rowSpan: rowspan
                };
                return React.createElement(Renderer, props);
            }
        },

        // 生成统计栏
        summaryFactory: function summaryFactory(me) {
            if (!me.props.flags || !me.props.flags.showSummary || !tools.haveDate(me)) {
                return null;
            }
            var td = [];
            var fields = tools.fieldConfigFactory(me, Others);
            var summary = me.props.summary;
            for (var i = 0; i < fields.length; i++) {
                var item = fields[i];
                var tdStyle = {};
                var text = !item.hasOwnProperty('field') ? '' : summary.hasOwnProperty(item.field) ? summary[item.field] : '-';
                text = fields[i].isSelector ? '' : text;
                tdStyle.textAlign = item.align || 'left';
                td.push(React.createElement(
                    'td',
                    { style: tdStyle, key: 'summary-' + i },
                    text
                ));
            }
            return React.createElement(
                'tr',
                { className: 'tr-summary', key: 'tr-summray' },
                td
            );
        },

        // 生成message栏
        messageFactory: function messageFactory(me) {
            if (!me.props.flags || !me.props.flags.showMessage || !tools.haveDate(me)) {
                return null;
            }
            var fields = tools.fieldConfigFactory(me, Others);
            var messageConfig = util.extend({}, me.props.message);
            var Message = typeof messageConfig.renderer === 'function' ? messageConfig.renderer : TableMessage;
            delete messageConfig.renderer;
            return React.createElement(Message, _extends({}, messageConfig, { onAction: me.props.onAction, colSpan: fields.length }));
        },

        // 生成行
        lineFactory: function lineFactory(me, isShadow) {
            var lines = [];
            var config = tools.fieldConfigFactory(me, Others);;
            var datasource = me.props.datasource instanceof Array ? me.props.datasource : [];
            // 没有数据源
            if (!tools.haveDate(me)) {
                var NoData = typeof me.props.noDataRenderer === 'function' ? me.props.noDataRenderer : NoDataRenderer;
                return React.createElement(
                    'tr',
                    { className: 'tr-data tr-nodata' },
                    React.createElement(
                        'td',
                        { colSpan: config.length, style: { textAlign: 'center' } },
                        React.createElement(NoData, { tableComponent: me })
                    )
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
                    td.push(React.createElement(Renderer, props));
                }
                lines.push(React.createElement(
                    'tr',
                    trProp,
                    td
                ));
            }
            return lines;
        }
    };
});