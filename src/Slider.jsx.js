/**
 * 数值滑竿
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2.1
 */
define(function (require) {


    var React = require('react');
    var InputWidget = require('./mixins/InputWidget');
    var DragableWidget = require('./mixins/DragableWidget');
    var WarningLayer = require('./WarningLayer.jsx');


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
         * @param {Function} onDrag 拖拽时的回调函数
         * @param {String} measure 说明框上显示的单位
         * @param {Boolean} showLabel 是否显示说明框
         * @param {Import|Properties} src\mixins\InputWidget.js
         *      value onChange name validations customErrorTemplates valueTemplate
         */
        /**
         * @fire Import src\mixins\InputWidget.js XXX onChange
         */
        contextTypes: {
            appSkin: React.PropTypes.string
        },
        // @override
        mixins: [InputWidget, DragableWidget],
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
            return {
                valuePosition: -1,
                anchor: null
            };
        },
        componentDidMount: function () {
            this.setState({anchor: this.refs.cursor});
        },
        onDragStart: function (e) {
            if (this.props.disabled) return;
            this.setState({
                valuePosition: tool.value2position(this.___getValue___(), this, 10)
            });
            this.___dragStart___(e);
        },
        onDrag: function (dx, dy) {
            var newPos = this.state.valuePosition + dx;
            newPos = newPos < 10 ? 10 : newPos;
            newPos = newPos > this.refs.container.offsetWidth - 10 ? this.refs.container.offsetWidth - 10 : newPos;
            this.setState({
                valuePosition: newPos
            });
            var newValue = tool.position2value(newPos, this, 10);
            typeof this.props.onDrag === 'function' && this.props.onDrag(newValue);
        },
        onDrop: function (dx, dy) {
            this.setState({
                valuePosition: -1
            });
            this.changeValue(dx);
        },
        onClick: function (e) {
            if (this.props.disabled) return;
            var pos = util.getDOMPosition(this.refs.container);
            var oldPos = tool.value2position(this.___getValue___(), this, 10);
            this.changeValue(e.clientX - pos.x - oldPos);
        },
        changeValue: function (dx) {

            var newPos = tool.value2position(this.___getValue___(), this, 10) + dx;
            newPos = newPos < 10 ? 10 : newPos;
            newPos = newPos > this.refs.container.offsetWidth - 10 ? this.refs.container.offsetWidth - 10 : newPos;

            var newValue = tool.position2value(newPos, this, 10);
            var oldValue = tool.displayValue(this.___getValue___(), this) * 1;
            var step = tool.getValidStep(this.props.step);
            var dValue = Math.abs(newValue - oldValue);
            var dDirect = newValue - oldValue > 0 ? 1 : -1;

            dValue = parseInt(dValue / step, 10) * step;
            dValue = dValue < Math.abs(newValue - oldValue) ? (dValue + step) : dValue;
            newValue = oldValue + dValue * dDirect;
            var e = {};
            e = {target: this.refs.container};
            e.target.value = tool.displayValue(newValue, this);
            this.___dispatchChange___(e);

        },
        render: function () {
            var value = this.___getValue___();
            var valuePosition = tool.value2position(value, this, 10);
            valuePosition = isNaN(valuePosition) ? 10 : valuePosition;
            valuePosition = this.state.valuePosition > -1 ? this.state.valuePosition : valuePosition;
            var cursorProp = {
                ref: 'cursor',
                className: 'fcui2-slider-cursor',
                style: {left: valuePosition - 8},
                onMouseDown: this.onDragStart
            };
            var warningLayerProps = {
                message: tool.displayValue(tool.position2value(valuePosition, this, 10), this) + this.props.measure,
                location: '12.5',
                skin: this.context.appSkin === 'oneux4' ? 'black' : 'blue',
                anchor: this.props.showLabel ? this.state.anchor : null
            };
            return (
                <div {...cTools.containerBaseProps('slider', this)} onClick={this.onClick}>
                    <div className="fcui2-slider-base-axis"></div>
                    <div className="fcui2-slider-left-rule"></div>
                    <div className="fcui2-slider-right-rule"></div>
                    <div className="fcui2-slider-value-axis" style={{width: valuePosition + 7}}></div>
                    <div {...cursorProp}></div>
                    <WarningLayer {...warningLayerProps}/>
                </div>
            );
        }
    });


});
