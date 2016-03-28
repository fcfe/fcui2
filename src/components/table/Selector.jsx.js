define(function (require) {


    var React = require('react');
    var language = require('../../core/language');
    var MouseWidgetBase = require('../../mixins/MouseWidgetBase');
    var LayerContainerBase = require('../../mixins/LayerContainerBase');


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
            var mainCheckbox = this.refs.mainCheckbox;
            mainCheckbox.indeterminate = i !== -1 && i > 0;
        },
        layerAction: function (e) {
            this.layerHide();
            this.props.onClick(e);
        },
        mainSelectorHandler: function (e) {
            var i = getSelectNum(this.props.selected);
            // 如果是全选或当页全选，则取消所有选择；否则选中当前页
            e.target.value = (i === -1 || i === this.props.tableItems.length) ? '-3' : '-2';
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
            var mainCheckboxProp = {
                type: 'checkbox',
                checked: i === -1,
                className: 'td-selector',
                disabled: this.props.disabled,
                ref: 'mainCheckbox',
                onClick: this.mainSelectorHandler
            };
            return (
                <div {...containerProp}>
                    <div className="icon-right font-icon font-icon-largeable-caret-down"></div>
                    <input {...mainCheckboxProp}/>
                </div>
            );
        }
    });
});
