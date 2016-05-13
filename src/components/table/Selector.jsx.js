define(function (require) {


    var React = require('react');
    var language = require('../../core/language');
    var MouseWidgetBase = require('../../mixins/MouseWidgetBase');
    var LayerContainerBase = require('../../mixins/LayerContainerBase');

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
        mixins: [MouseWidgetBase, LayerContainerBase],
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
                onClick: function () {},
                layerContent: require('../../List.jsx'),
                layerProps: {},
                layerInterface: 'onClick'
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
        layerAction: function (e) {
            this.layerHide();
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
            this.___mouseenterHandler___();
            if (this.props.disabled) return;
            this.layerShow();
        },
        // @override
        render: function () {
            var i = getSelectNum(this.props.selected);
            var containerProp = {
                className: 'table-selector fcui2-dropdownlist',
                onMouseEnter: this.mouseEnterHandler,
                onMouseLeave: this.___mouseleaveHandler___,
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
            return (
                <div {...containerProp}>
                    <div className="icon-right font-icon font-icon-largeable-caret-down"></div>
                    <input {...mainCheckboxProp}/>
                </div>
            );
        }
    });
});
