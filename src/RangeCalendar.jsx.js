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
                // 快捷按钮配置串，每一位代表一个开关，共10位，1标识开启，0标识关闭。分别对应：
                // 今天、昨天、前天、上周、过去7天、过去14天、过去30天、本月、上月、上季度
                shortCut: '0000000000',
                min: '0-1-1',
                max: '9999-12-31',
                disable: false,
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
            if (this.props.disable || value === e.target.value) return;
            this.___dispatchChange___(e);
            this.layerHide();
        },
        mouseenterHandler: function (e) {
            if (this.props.disable) return;
            this.___mouseenterHandler___();
            this.layerShow({
                value: this.___getValue___(),
                min: this.props.min,
                max: this.props.max,
                shortCut: this.props.shortCut,
                rangeValidator: this.props.rangeValidator,
                close: this.layerHide
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
                onMouseEnter: this.mouseenterHandler,
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
                    <div className="label-container">{label.replace(/-/g, '.').replace(/;/g, ' - ')}</div>
                </div>
            );
        }
    });
});
