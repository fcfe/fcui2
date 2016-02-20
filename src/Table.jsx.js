define(function (require) {

    var TableHeader = require('./tableRenderer/TableHeader.jsx');
    var TableSelector = require('./tableRenderer/TableSelector.jsx');
    var NormalRenderer = require('./tableRenderer/NormalRenderer.jsx');
    var React = require('react');
    var util = require('./core/util.es6');
    var mixins = require('./core/mixins.jsx');
    var language = require('./core/language');

    // 生成列宽度
    function colgroupFactory(me) {
        var td = [];
        var conf = me.props.conf
        if (me.props.showSelector) {
            td.push(<col width="45" key='col-selector'/>);
        }
        for (var i = 0; i < conf.length; i++) {
            td.push(<col width={conf[i].width} key={'col-' + i}/>);
        }
        return <colgroup>{td}</colgroup>
    }

    // 生成表头
    function headerFactory(me) {
        if (!me.props.showHeader) return (<tr></tr>);
        var td = [];
        var conf = me.props.conf;
        if (me.props.showSelector) {
            var selectorProp = {
                isAllSelected: me.state.selectedIndex[-1] || me.props.datasource.length === me.state.selectedItems.length,
                selectedIndex: me.state.selectedIndex,
                onAction: me.rowSelected
            }
            td.push(<td key="head-select"><TableSelector {...selectorProp}/></td>);
        }
        for (var i = 0; i < conf.length; i++) {
            var key = 'head-' + i;
            td.push(<TableHeader {...conf[i]} onSort={me.sortHandler} sortField={me.state.sortField} key={key}/>);
        }
        return <tr className="table-header" key="table-head">{td}</tr>;
    }

    // 生成统计栏
    function summaryFactory(me) {
        if (!me.props.showSummary) return (<tr></tr>);
        var td = [];
        var conf = me.props.conf;
        var summary = me.props.summary;
        if (me.props.showSelector) td.push(<td key="summary-select"></td>);
        for (var i = 0; i < conf.length; i++) {
            var item = conf[i];
            var tdStyle = {};
            var text = summary.hasOwnProperty(item.field) ? summary[item.field] : '-';
            if (typeof item.width === 'number') tdStyle.width = item.width;
            tdStyle.textAlign = isNaN(text) ? 'left' : 'right';
            td.push(<td style={tdStyle} key={'summary-' + i}>{text}</td>);
        }
        return <tr className="table-summary" key="table-summray" style={{fontWeight: 700}}>{td}</tr>
    }

    // 生成message栏目
    function messageFactory(me) {
        var message = me.state.message;
        var conf = me.props.conf;
        if (message.length === 0 || !me.props.showMessage) return (<tr></tr>);
        return (
            <tr className="table-message">
                <td colSpan={conf.length + 10}>
                    <div className="font-icon font-icon-times" onClick={me.closeMessageBar}></div>
                    <span>{message}</span>
                    <span onClick={me.messageBarClickHandler} className="link">{me.props.messageButtonLabel}</span>
                </td>
            </tr>
        );
    }

    return React.createClass({
        // @override
        mixins: [mixins.fixedContainer, mixins.resizeContainer],
        // @override
        getDefaultProps: function () {
            return {
                className: '',
                conf: [],
                datasource: [],
                summary: {},
                message: '',
                messageButtonLabel: language.button.fresh,
                fixedPosition: [
                    {ref: 'shadowTableContainer', top: 0, zIndex: 999}
                ],
                showHeader: true,
                showSummary: true,
                showMessage: true,
                showSelector: true,
                onAction: function () {}
            };
        },
        // @override
        getInitialState: function () {
            return {
                message: this.props.message,
                sortField : '',
                selectedIndex: {},
                selectedItems: []
            };
        },
        // @override
        componentDidMount: function () {
            window.addEventListener('scroll', this.scrollHandler);
            window.addEventListener('resize', this.resizeHandler);
            this.updateWidth();
            this.recordFixedDOMPosition();
        },
        // @override
        componentWillUnmount: function () {
            window.removeEventListener('scroll', this.scrollHandler);
            window.removeEventListener('resize', this.resizeHandler);
        },
        // @override
        componentDidUpdate: function () {
            this.updateWidth();
        },
        resizing: function () {
            this.updateWidth();
        },
        sortHandler: function (e) {
            this.props.onAction('TableSort', {
                field: e.field,
                order: e.sortType
            });
            this.setState({sortField: e.field});
        },
        messageBarClickHandler: function (e) {
            this.props.onAction('TableMessageBarClick', {});
        },
        actionHandler: function (type, param) {
            this.props.onAction(type, param);
        },
        updateWidth: function () {
            var width = this.refs.container.offsetWidth - 2;
            var table = this.refs.table;
            var shadow = this.refs.shadow;
            var tbody = this.refs.tbody;
            var shadowContainer = this.refs.shadowTableContainer;
            var height = 0;
            table.style.maxWidth = shadow.style.maxWidth = width + 'px';
            table.style.minWidth = shadow.style.minWidth = width + 'px';
            for (var i = 0; i < tbody.childNodes.length; i++) {
                var tr = tbody.childNodes[i];
                if (tr.className.indexOf('tr-data') > -1) break;
                height += tr.offsetHeight;
            }
            shadowContainer.style.height = height + 'px';
        },
        closeMessageBar: function () {
            this.setState({message: ''});
        },
        rowSelected: function (e) {
            var select = this.state.selectedIndex;
            var items = [];
            delete select[-1];
            if (e === -3) { // -3 取消当前所有选中，没有时间写常量了
                select = {};
            }
            else if (e === -1 || e === -2) { // -1 全部选中；-2 选中当前页；没有时间写常量了
                if (e === -1) select[-1] = true;
                for (var i = 0; i < this.props.datasource.length; i++) select[i] = true;
            }
            else {
                var value = e.target.checked;
                var id = parseInt(util.getDataset(e.target).uiCmd);
                if (value) {
                    select[id] = true;
                }
                else {
                    delete select[id];
                }
            }
            if (select[-1]) {
                items = -1;
            }
            else {
                for (var key in select) {
                    if (select.hasOwnProperty(key)) items.push(parseInt(key, 10));
                }
                items.sort();
                for (var i = 0; i < items.length; i++) {
                    items[i] = this.props.datasource[items[i]];
                }
            }
            this.setState({selectedIndex: select, selectedItems: items});
            this.props.onAction('TableSelect', {items: items});
        },
        lineFactory: function (item, index, arr) {
            var td = [];
            var me = this;
            var conf = this.props.conf;
            var selected = me.state.selectedIndex[index] || me.state.selectedIndex[-1];
            if (me.props.showSelector) {
                var selectorProp = {
                    type: 'checkbox',
                    className: 'tr-selector',
                    checked: selected,
                    'data-ui-cmd': index,
                    onChange: me.rowSelected,
                };
                td.push(<td key="row-select" className="td-selector-container"><input {...selectorProp}/></td>);
            }
            for (var i = 0; i < conf.length; i++) {
                var props = {
                    item: item,
                    index: index,
                    conf: conf[i],
                    onAction: me.actionHandler,
                    key: 'column-' + i
                };
                if (conf[i].hasOwnProperty('color')) {
                    if (typeof conf[i].color === 'function') {
                        props.color = conf[i].color(item);
                    }
                    else {
                        props.color = conf[i].color + '';
                    }
                }
                var renderer = typeof conf[i].renderer === 'function' ? conf[i].renderer : NormalRenderer;
                td.push(React.createElement(renderer, React.__spread({}, props)));
            }
            return <tr key={'row-' + index} className={selected ? 'tr-data tr-selected' : 'tr-data'}>{td}</tr>;
        },
        // @override
        render: function () {
            return (
                <div className={'fcui2-table ' + this.props.className} ref="container">
                    <div ref="realTable" className="table-container">
                        <table ref="table" cellSpacing="0" cellPadding="0">
                            {colgroupFactory(this)}
                            <tbody ref="tbody">
                            {headerFactory(this)}
                            {summaryFactory(this)}
                            {messageFactory(this)}
                            {this.props.datasource.map(this.lineFactory)}
                            </tbody>
                        </table>
                    </div>
                    <div ref="shadowTableContainer" className="shadow-container">
                        <table ref="shadow" cellSpacing="0" cellPadding="0">
                            {colgroupFactory(this)}
                            <tbody>
                            {this.props.datasource.map(this.lineFactory)}
                            {headerFactory(this)}
                            {summaryFactory(this)}
                            {messageFactory(this)}
                            </tbody>
                        </table>
                    </div>
                </div>
            );
        }
    });
});
