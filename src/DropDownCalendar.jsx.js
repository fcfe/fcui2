/**
 * @file 日期选择框组件
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
    var tools = require('./core/calendarTools');
    var util = require('./core/util');


    return React.createClass({
        // @override
        mixins: [MouseWidgetBase, LayerContainerBase, InputWidgetBase, InputWidgetInForm],
        // @override
        getDefaultProps: function () {
            return {
                className: '',
                minWidth: 100,
                width: NaN,
                placeholder: 'please select',
                min: '0-0-0',
                max: '9999-99-99',
                disable: false,
                valueTemplate: '',
                // 以下为LayerContainerBase中需要的配置
                layerContent: require('./Calendar.jsx'),
                layerProps: {},
                layerInterface: 'onChange'
            };
        },
        // @override
        getInitialState: function () {
            return {};
        },
        layerAction: function (e) {
            var value = this.___getValue___();
            if (this.props.disable || value === e.target.value) return;
            this.layerUpdateProp({
                min: this.props.min,
                max: this.props.max,
                value: e.target.value
            });
            this.___dispatchChange___(e);
            this.layerHide();
        },
        mouseEnterHandler: function (e) {
            this.___mouseenterHandler___();
            if (this.props.disable) return;
            this.layerShow({
                value: this.___getValue___(),
                min: this.props.min,
                max: this.props.max
            });
        },
        render: function () {
            var me = this;
            var containerProp = {
                className: 'fcui2-dropdownlist ' + this.props.className,
                style: {
                    minWidth: this.props.minWidth,
                    borderColor: this.state.isValid === false ? '#F00' : undefined 
                },
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
            var label = this.___getValue___() || this.props.placeholder;
            return (
                <div {...containerProp}>
                    <div className="icon-right font-icon font-icon-calendar"></div>
                    <div className="label-container">{label}</div>
                </div>
            );
        }
    });
});
