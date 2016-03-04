define(function (require) {


    var React = require('react');


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
                if (tr.className.indexOf('table-summary') > -1) break;
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
        // @override
        render: function () {
            return (
                <div className={'fcui2-table ' + this.props.className} ref="container">
                    <div ref="realTable" className="table-container">
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
});
