/**
 * @file 下拉地域选择器组件
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.1
 */
define(function (require) {


    var React = require('react');
    var MouseWidgetBase = require('./mixins/MouseWidgetBase');
    var LayerContainerBase = require('./mixins/LayerContainerBase');
    var InputWidgetBase = require('./mixins/InputWidgetBase');
    var InputWidgetInForm = require('./mixins/InputWidgetInForm');


    return React.createClass({
        // @override
        mixins: [InputWidgetBase, InputWidgetInForm, MouseWidgetBase, LayerContainerBase],
        // @override
        getDefaultProps: function () {
            return {
                className: '',
                label: 'DropDownRegion',
                minWidth: 60,
                width: NaN,
                disabled: false,
                shortCut: [],
                // 以下为LayerContainerBase中需要的配置
                layerContent: require('./components/RegionLayer.jsx'),
                layerProps: {},
                layerInterface: 'onChange',
                type: 'multi'
            };
        },
        layerAction: function (e) {
            if (this.props.disabled) return;
            var value = this.___getValue___();
            if (this.props.disabled || value === e.target.value) return;
            this.___dispatchChange___(e);
            this.layerHide();
        },
        clickHandler: function (e) {
            if (this.props.disabled) return;
            if (this.___layer___) {
                this.layerHide();
                return;
            }
            this.layerShow({
                shortCut: this.props.shortCut,
                value: this.___getValue___(),
                close: this.layerHide,
                type: this.props.type
            }, true);
        },
        render: function () {
            var me = this;
            var containerProp = {
                className: 'fcui2-dropdownlist ' + this.props.className,
                style: {minWidth: this.props.minWidth},
                onMouseEnter: this.___mouseenterHandler___,
                onMouseLeave: this.___mouseleaveHandler___,
                onClick: this.clickHandler,
                ref: 'container'
            };
            if (this.props.disabled) {
                containerProp.className += ' fcui2-dropdownlist-disabled';
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
