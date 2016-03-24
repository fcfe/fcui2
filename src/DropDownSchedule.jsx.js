/**
 * @file 下拉时间选择器组件
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
                label: 'DropDownSchedule',
                minWidth: 60,
                width: NaN,
                disable: false,
                shortCut: [],
                // 以下为LayerContainerBase中需要的配置
                layerContent: require('./components/ScheduleLayer.jsx'),
                layerProps: {},
                layerInterface: 'onChange'
            };
        },
        layerAction: function (e) {
            if (this.props.disable) return;
            var value = this.___getValue___();
            if (this.props.disable || value === e.target.value) return;
            this.___dispatchChange___(e);
            this.layerHide();
        },
        mouseEnterHandler: function (e) {
            this.___mouseenterHandler___();
            if (this.props.disable) return;
            this.layerShow({
                shortCut: this.props.shortCut,
                value: this.___getValue___(),
                close: this.layerHide
            });
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
