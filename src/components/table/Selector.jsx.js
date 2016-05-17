/**
 * @file 表头列选择器
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.1
 */
define(function (require) {


    var React = require('react');
    var language = require('../../core/language');
    var Layer = require('../../Layer.jsx');
    var List = require('../../List.jsx');


    var SELECT_MODE = {
        CURRENT_PAGE: '2',
        ALL: '3'
    };
    var SELECT_COMMAND = {
        CURRENT_PAGE: '-2',
        CLEAR: '-3'
    };


    function getSelectNum(obj) {
        if (obj === -1) return -1;
        var n = 0;
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) n++;
        }
        return n;
    }


    return React.createClass({
        // @override
        getDefaultProps: function () {
            return {
                type: 1, // 见SELECT_MODE
                selected: {},
                tableItems: [],
                datasource: [
                    {label: language.tableSelector.selectCurrentPage, value: '-2'},
                    {label: language.tableSelector.selectAll, value: '-1'}
                ],
                onClick: function () {}
            };
        },
        // @override
        getInitialState: function () {
            return {
                layerOpen: false
            };
        },
        // @override
        componentDidUpdate: function () {
            var i = getSelectNum(this.props.selected);
            var workMode = this.props.type + '';
            var mainCheckbox = this.refs.mainCheckbox;
            if (workMode === SELECT_MODE.CURRENT_PAGE) {
                mainCheckbox.indeterminate = i > 0 && i < this.props.tableItems.length;
            }
            else {
                mainCheckbox.indeterminate = i !== -1 && i > 0;
            }
        },
        listClickHandler: function (e) {
            this.setState({layerOpen: false});
            this.props.onClick(e);
        },
        mainSelectorHandler: function (e) {
            var i = getSelectNum(this.props.selected);
            var workMode = this.props.type + '';
            e.target = this.refs.container;
            if (workMode === SELECT_MODE.CURRENT_PAGE) {
                e.target.value = i === this.props.tableItems.length
                    ? SELECT_COMMAND.CLEAR : SELECT_COMMAND.CURRENT_PAGE;
            }
            else {
                // 如果是全选或当页全选，则取消所有选择；否则选中当前页
                e.target.value = (i === -1 || i === this.props.tableItems.length)
                    ? SELECT_COMMAND.CLEAR : SELECT_COMMAND.CURRENT_PAGE;
            }
            this.props.onClick(e);
        },
        mouseEnterHandler: function (e) {
            if (this.props.disabled) return;
            this.setState({layerOpen: true});
        },
        mouseLeaveHandler: function (e) {
            var me = this;
            // 延迟关闭
            setTimeout(function () {
                if (me.refs.layer && me.refs.layer.state.mouseenter) return;
                me.setState({layerOpen: false});
            }, 200);
        },
        // @override
        render: function () {
            var i = getSelectNum(this.props.selected);
            var containerProp = {
                className: 'table-selector fcui2-dropdownlist',
                onMouseEnter: this.mouseEnterHandler,
                onMouseLeave: this.mouseLeaveHandler,
                ref: 'container'
            };
            var workMode = this.props.type + '';
            var mainCheckboxProp = {
                type: 'checkbox',
                checked: i === -1 || (workMode === SELECT_MODE.CURRENT_PAGE && i === this.props.tableItems.length),
                className: 'td-selector',
                disabled: this.props.disabled,
                ref: 'mainCheckbox',
                onClick: this.mainSelectorHandler
            };
            if (workMode === SELECT_MODE.CURRENT_PAGE || workMode === SELECT_MODE.ALL) {
                return (
                    <div ref="container" className="table-selector fcui2-dropdownlist">
                        <input {...mainCheckboxProp}/>
                    </div>
                );
            }
            var layerProp = {
                 isOpen: this.state.layerOpen && !this.props.disabled,
                 anchor: this.refs.container,
                 location: 'bottom top right',
                 onMouseLeave: this.mouseLeaveHandler,
                 ref: 'layer'
            };
            return (
                <div {...containerProp}>
                    <div className="icon-right font-icon font-icon-largeable-caret-down"></div>
                    <input {...mainCheckboxProp}/>
                    <Layer {...layerProp}>
                        <List datasource={this.props.datasource} onClick={this.listClickHandler}/>
                    </Layer>
                </div>
            );
        }
    });
});
