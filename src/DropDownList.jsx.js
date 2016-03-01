/**
 * @file 下拉控制列表组件
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.1
 */
define(function (require) {


    var React = require('react');
    var MouseWidgetBase = require('./mixins/MouseWidgetBase');
    var LayerContainerBase = require('./mixins/LayerContainerBase');


    return React.createClass({
        // @override
        mixins: [MouseWidgetBase, LayerContainerBase],
        // @override
        getDefaultProps: function () {
            return {
                className: '',
                label: 'DropDownList',
                minWidth: 60,
                width: NaN,
                disable: false,
                datasource: [],         //见List
                onClick: function () {},
                // 以下为LayerContainerBase中需要的配置
                layerContent: require('./List.jsx'),
                layerProps: {},
                layerInterface: 'onClick'
            };
        },
        layerAction: function (e) {
            if (this.props.disable) return;
            this.props.onClick(e);
            this.layerHide();
            e.stopPropagation();
        },
        mouseEnterHandler: function (e) {
            this.___mouseenterHandler___();
            if (this.props.datasource.length === 0 || this.props.disable) return;
            this.layerShow();
        },
        render: function () {
            var me = this;
            var containerProp = {
                className: 'fcui2-dropdownlist ' + this.props.className,
                style: {minWidth: this.props.minWidth},
                onMouseEnter: this.mouseEnterHandler,
                onMouseLeave: this.___mouseleaveHandler___,
                ref: 'container'
            };
            if (this.props.disable) {
                containerProp.className += ' fcui2-dropdownlist-disable';
            }
            if (!isNaN(this.props.width)) {
                delete containerProp.style.minWidth;
                containerProp.style.width = this.props.width;
            }
            return (
                <div {...containerProp}>
                    <div className="icon-right font-icon font-icon-largeable-caret-down"></div>
                    <span>{this.props.label}</span>
                </div>
            );
        }
    });
});
