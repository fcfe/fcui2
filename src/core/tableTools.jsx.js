define(function (require) {


    var React = require('react');


    var TableHeader = require('../components/table/TableHeader.jsx');
    var TableSelector = require('../components/table/TableSelector.jsx');
    var NormalRenderer = require('../components/table/NormalRenderer.jsx');
    var language = require('./language');


    var STYLES = {
        align: 'textAlign',
        color: 'color'
    };


    /**
     * 根据fieldConfig的配置生成渲染单元格的props
     *
     * @param {Object} conf 列配置
     * @param {Object} item 数据源
     * @param {Object} me 当前react对象
     * @param {number} row item在datasource的行索引
     * @param {number} column 当前渲染的列索引
     * @return {Object} 用于渲染row行column列的props
     */
    function tdPropsFactory(conf, item, me, row, column) {
        // 深度克隆fieldConfig
        var props = JSON.parse(JSON.stringify(conf));
        // 导入数据、索引、回调、key
        props.item = item;
        props.index = row;
        props.onAction = me.props.onAction;
        props.key = 'column-' + column;
        // 处理prepare，将item和props回传给conf.prepare，由prepare以指针形式操作props
        if (typeof conf.prepare === 'function') {
            conf.prepare(props, item, row, column);
        }
        // 对content域进行特殊处理
        if (typeof conf.content === 'function') {
            props.content = conf.content(item, row, column);
        }
        else if (typeof conf.content === 'string' && item.hasOwnProperty(conf.content)) {
            props.content = item[conf.content];
        }
        else if (!conf.hasOwnProperty('content') && conf.hasOwnProperty('field')) {
            props.content = item[conf.field];
        }
        else {
            props.content = '';
        }
        // 将某些style从conf中挪到props.style
        props.style = props.style || {};
        for (var key in STYLES) {
            var styleName = STYLES[key];
            if (conf.hasOwnProperty(key) && !props.style.hasOwnProperty(styleName)) {
                props.style[styleName] = conf[key];
            }
        }
        return props;
    }


    return {
        // 透传内部方法
        tdPropsFactory: tdPropsFactory,
        // 生成列宽度
        colgroupFactory: function (me) {
            var td = [];
            var conf = me.props.fieldConfig;
            // if (me.props.showSelector) {
            //     td.push(<col width="45" key='col-selector'/>);
            // }
            for (var i = 0; i < conf.length; i++) {
                td.push(<col width={conf[i].width} key={'colgroup-' + i} />);
            }
            return <colgroup>{td}</colgroup>
        },

        // 生成表头
        headerFactory: function (me) {
            if (!me.props.flags || me.props.flags.hideHeader) {
                return (<tr style={{display: 'none'}}></tr>);
            }
            var td = [];
            var conf = me.props.fieldConfig;
            // if (me.props.showSelector) {
            //     var selectorProp = {
            //         isAllSelected: me.state.selectedIndex[-1] || me.props.datasource.length === me.state.selectedItems.length,
            //         selectedIndex: me.state.selectedIndex,
            //         onAction: me.rowSelected
            //     }
            //     td.push(<td key="head-select"><TableSelector {...selectorProp}/></td>);
            //}
            for (var i = 0; i < conf.length; i++) {
                var headerProp = {
                    tableValue: me.___getValue___(),
                    tableFlags: me.props.flags || {},
                    key: 'header-' + i,
                    onClick: me.___dispatchChange___
                }
                td.push(<TableHeader {...conf[i]} {...headerProp} />);
            }
            return <tr className="tr-header" key="tr-header">{td}</tr>;
        },

        // 生成统计栏
        summaryFactory: function (me) {
            return '';
            // if (!me.props.showSummary) return (<tr></tr>);
            // var td = [];
            // var conf = me.props.conf;
            // var summary = me.props.summary;
            // if (me.props.showSelector) td.push(<td key="summary-select"></td>);
            // for (var i = 0; i < conf.length; i++) {
            //     var item = conf[i];
            //     var tdStyle = {};
            //     var text = summary.hasOwnProperty(item.field) ? summary[item.field] : '-';
            //     if (typeof item.width === 'number') tdStyle.width = item.width;
            //     tdStyle.textAlign = isNaN(text) ? 'left' : 'right';
            //     td.push(<td style={tdStyle} key={'summary-' + i}><span style={{fontWeight: 700}}>{text}</span></td>);
            // }
            // return <tr className="table-summary" key="table-summray">{td}</tr>
        },

        // 生成message栏
        messageFactory: function (me) {
            return '';
            // var message = me.props.message;
            // var conf = me.props.conf;
            // if (message.length === 0 || !me.props.showMessage) return (<tr></tr>);
            // return (
            //     <tr className="table-message">
            //         <td colSpan={conf.length + 10}>
            //             <div className="font-icon font-icon-times" onClick={me.closeMessageBar}></div>
            //             <span>{message}</span>
            //             <span onClick={me.messageBarClickHandler} className="link">{me.props.messageButtonLabel}</span>
            //         </td>
            //     </tr>
            // );
        },

        // 生成行
        lineFactory: function (me) {
            var lines = [];
            var config = me.props.fieldConfig instanceof Array ? me.props.fieldConfig : [];
            var datasource = me.props.datasource instanceof Array ? me.props.datasource : [];
            if (datasource.length === 0 || config.length === 0) {
                return (
                    <tr>
                        <td colSpan={config.length + 10} style={{textAlign: 'center'}}>
                            <div className="table-nodata">{language.table.noData}</div>
                        </td>
                    </tr>
                );
            }
            for (var index = 0; index < datasource.length; index++) {
                var item = datasource[index];
                var td = [];
                // var selected = me.state.selectedIndex[index] || me.state.selectedIndex[-1];
                // if (me.props.showSelector) {
                //     var selectorProp = {
                //         type: 'checkbox',
                //         className: 'tr-selector',
                //         checked: selected,
                //         'data-ui-cmd': index,
                //         onChange: me.rowSelected,
                //     };
                //     td.push(<td key="row-select" className="td-selector-container"><input {...selectorProp}/></td>);
                // }
                for (var j = 0; j < config.length; j++) {
                    var props = tdPropsFactory(config[j], item, me, index, j);
                    var renderer = typeof config[j].renderer === 'function' ? config[j].renderer : NormalRenderer;
                    td.push(React.createElement(renderer, props));
                }
                var selected = false;
                lines.push(<tr key={'row-' + index} className={selected ? 'tr-data tr-selected' : 'tr-data'}>{td}</tr>);
            }
            return lines;
        }
    };
})
