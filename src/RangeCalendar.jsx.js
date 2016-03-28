/**
 * @file 日期区间选择框组件
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


    // 浮层弹出按钮
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
                /**
                 * 快捷按钮配置
                 * 两个日历上方的快捷按钮配置，按钮的一切都由外部导入，包括处理函数，元素格式如下：
                 * {label: '今天', getValues: function () {return {value1: new Date(), value2: new Date()};}}
                 */
                shortCut: [],
                min: '0-1-1',
                max: '9999-12-31',
                disabled: false,
                valueTemplate: '',
                rangeValidator: function () {},
                // 以下为LayerContainerBase中需要的配置
                layerContent: require('./components/RangeCalendarLayer.jsx'),
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
                value: this.___getValue___(),
                min: this.props.min,
                max: this.props.max,
                shortCut: this.props.shortCut,
                rangeValidator: this.props.rangeValidator,
                close: this.layerHide
            }, true);
        },
        render: function () {
            var me = this;
            var containerProp = {
                className: 'fcui2-dropdownlist ' + this.props.className,
                style: {
                    minWidth: this.props.minWidth,
                    borderColor: this.state.isValid === false ? '#F00' : undefined 
                },
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
            var label = this.___getValue___() || this.props.placeholder;
            return (
                <div {...containerProp}>
                    <div className="icon-right font-icon font-icon-calendar"></div>
                    <div className="label-container">{label.replace(/-/g, '.').replace(/;/g, ' - ')}</div>
                </div>
            );
        }
    });
});
