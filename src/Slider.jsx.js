/**
 * @file 滑块组件
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.1
 */
define(function (require) {


    var React = require('react');
    var InputWidget = require('./mixins/InputWidget');
    
    var tool = require('./core/sliderTools');
    var util = require('./core/util');


    return React.createClass({
        // @override
        mixins: [InputWidget],
        // @override
        getDefaultProps: function () {
            return {
                className: '',
                width: 200,
                max: 100,
                min: 0,
                step: 1,
                measure: '',
                type: 'int', // int, float
                fixed: 2,
                valueTemplate: 0,
                disabled: false,
                showLabel: false
            };
        },
        // @override
        getInitialState: function () {
            return {mouseX: -1};
        },
        mousedownHandler: function (e) {
            this.setState({mouseX: e.clientX});
        },
        changeValue: function (newPosition, mouseState, e) {
            var oldValue = tool.displayValue(this.___getValue___(), this.props) * 1;
            var newValue = tool.position2value(newPosition, this.props, 10);
            var step = isNaN(this.props.step) ? 1: this.props.step * 1;
            newValue = oldValue + Math.round((newValue - oldValue) / step) * step;
            e.target = this.refs.container;
            e.target.value = tool.displayValue(newValue, this.props);
            this.setState({mouseX: mouseState});
            this.___dispatchChange___(e);
        },
        mousemoveHandler: function (e) {
            if (this.state.mouseX < 0 || this.props.disabled) return;
            var p = tool.value2position(this.___getValue___(), this.props, 10) + e.clientX - this.state.mouseX;
            this.changeValue(p, e.clientX, e);
        },
        mouseleaveHandler: function (e) {
            if (this.props.disabled) return;
            this.setState({mouseX: -1});
        },
        mouseupHandler: function (e) {
            if (this.props.disabled) return;
            if (this.state.mouseX < 0) {
                var pos = util.getDOMPosition(this.refs.container);
                this.changeValue(e.clientX - pos.x, -1, e);
            }
            else {
                this.setState({mouseX: -1});
            }
        },
        render: function () {
            var value = this.___getValue___();
            var containerProp = {
                className: 'fcui2-slider ' + this.props.className,
                style: {width: this.props.width},
                ref: 'container',
                onMouseMove: this.mousemoveHandler,
                onMouseLeave: this.mouseleaveHandler,
                onMouseUp: this.mouseupHandler
            };
            var x = tool.value2position(value, this.props, 10);
            if (this.props.disabled) {
                containerProp.className += ' fcui2-slider-disabled'
            }
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
                        {tool.displayValue(value, this.props) + this.props.measure}
                        <span className="fcui2-slider-arrow"></span>
                    </div>
                    <div className="fcui2-slider-value-axis" style={{width: x}}></div>
                    <div className="fcui2-slider-cursor" style={{left: x - 8}} onMouseDown={this.mousedownHandler}></div>
                </div>
            );
        }
    });


});
