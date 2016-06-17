/**
 * 数值滑竿
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2.1
 */
define(function (require) {


    var React = require('react');
    var InputWidget = require('./mixins/InputWidget');


    var cTools = require('./core/componentTools');
    var tool = require('./core/sliderTools');
    var util = require('./core/util');


    return React.createClass({
        /**
         * @properties
         *
         * @param {Import|Properties} src\core\componentTools.js skin className style disabled
         * @param {Number} max 最大值
         * @param {Number} min 最小值
         * @param {Number} step 滑动后最小变动值
         * @param {String} type 数字的类型，float或int
         * @param {Number} fixed 保留的小数位数，只有当type为float时有效
         * @param {String} measure 说明框上显示的单位
         * @param {Boolean} showLabel 是否显示说明框
         * @param {Import|Properties} src\mixins\InputWidget.js
         *      value onChange name validations customErrorTemplates valueLink valueTemplate
         */
        /**
         * @fire Import src\mixins\InputWidget.js XXX onChange
         */
        // @override
        mixins: [InputWidget],
        // @override
        getDefaultProps: function () {
            return {
                // base
                skin: '',
                className: '',
                style: {},
                disabled: false,
                // self
                max: 100,
                min: 0,
                step: 1,
                measure: '',
                type: 'int',
                fixed: 2,
                showLabel: false,
                // mixin
                valueTemplate: 0
            };
        },
        // @override
        getInitialState: function () {
            return {mouseX: -1};
        },
        onMouseDown: function (e) {
            this.setState({mouseX: e.clientX});
        },
        onMouseMove: function (e) {
            if (this.state.mouseX < 0 || this.props.disabled) return;
            var p = tool.value2position(this.___getValue___(), this, 10) + e.clientX - this.state.mouseX;
            this.changeValue(p, e.clientX, e);
        },
        onMouseLeave: function (e) {
            if (this.props.disabled) return;
            this.setState({mouseX: -1});
        },
        onMouseUp: function (e) {
            if (this.props.disabled) return;
            if (this.state.mouseX < 0) {
                var pos = util.getDOMPosition(this.refs.container);
                this.changeValue(e.clientX - pos.x, -1, e);
            }
            else {
                this.setState({mouseX: -1});
            }
        },
        changeValue: function (newPosition, mouseState, e) {
            var oldValue = tool.displayValue(this.___getValue___(), this) * 1;
            var newValue = tool.position2value(newPosition, this, 10);
            var step = isNaN(this.props.step) ? 1: this.props.step * 1;
            newValue = oldValue + Math.round((newValue - oldValue) / step) * step;
            e.target = this.refs.container;
            e.target.value = tool.displayValue(newValue, this);
            this.setState({mouseX: mouseState});
            this.___dispatchChange___(e);
        },
        render: function () {
            var value = this.___getValue___();
            var containerProp = cTools.containerBaseProps('slider', this, {
                merge: {
                    onMouseMove: this.onMouseMove,
                    onMouseLeave: this.onMouseLeave,
                    onMouseUp: this.onMouseUp
                }
            });
            var x = tool.value2position(value, this, 10);
            x = isNaN(x) ? 10 : x;
            return (
                <div {...containerProp}>
                    <div className="fcui2-slider-base-axis"></div>
                    <div className="fcui2-slider-left-rule"></div>
                    <div className="fcui2-slider-right-rule"></div>
                    <div className="fcui2-slider-label-container"
                        style={{display: this.props.showLabel ? 'block' : 'none'}}
                    >
                        <span className="fcui2-slider-left-label">{this.props.min + this.props.measure}</span>
                        <span className="fcui2-slider-right-label">{this.props.max + this.props.measure}</span>
                    </div>
                    <div className="fcui2-slider-value-label"
                        style={{
                            left: x - 25,
                            display: this.props.showLabel ? 'block' : 'none'
                        }}>
                        {tool.displayValue(value, this) + this.props.measure}
                        <span className="fcui2-slider-arrow"></span>
                    </div>
                    <div className="fcui2-slider-value-axis" style={{width: x}}></div>
                    <div className="fcui2-slider-cursor" style={{left: x - 8}} onMouseDown={this.onMouseDown}></div>
                </div>
            );
        }
    });


});
