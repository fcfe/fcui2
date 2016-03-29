/**
 * @file 滑块组件
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.1
 */
define(function (require) {


    var React = require('react');
    var InputWidgetBase = require('./mixins/InputWidgetBase');
    var InputWidgetInForm = require('./mixins/InputWidgetInForm');
    var util = require('./core/util');


    return React.createClass({
        // @override
        mixins: [InputWidgetBase, InputWidgetInForm],
        // @override
        getDefaultProps: function () {
            return {
                className: '',
                width: 200,
                max: 100,
                min: 0,
                step: 5,
                measure: 'km',
                type: 'float', // int, float
                fixed: 2,
                valueTemplate: 0,
                disabled: false,
                showLabel: true,
                showMeasure: true
            };
        },
        // @override
        getInitialState: function () {
            return {};
        },
        changeHandler: function (e) {
            // if (this.props.disabled) return;
            // e.target.value = numberFormater(e.target.value, this.props);
            // this.___dispatchChange___(e);
        },
        render: function () {
            var value = this.___getValue___();
            var containerProp = {
                className: 'fcui2-slider ' + this.props.className,
                style: {width: this.props.width},
                ref: 'container'
            };
            var x = value2x(value, this.props);
            return (
                <div {...containerProp}>
                    <div className="fcui2-slider-base-axis"></div>
                    <div className="fcui2-slider-left-rule"></div>
                    <div className="fcui2-slider-right-rule"></div>
                    <div className="fcui2-slider-label-container">
                        <span className="fcui2-slider-left-label">{this.props.min + this.props.measure}</span>
                        <span className="fcui2-slider-right-label">{this.props.max + this.props.measure}</span>
                    </div>
                    <div className="fcui2-slider-value-label" style={{left: x - 25}}>
                        {displayValue(value, this.props) + this.props.measure}
                        <span className="fcui2-slider-arrow"></span>
                    </div>
                    <div className="fcui2-slider-value-axis" style={{width: x}}></div>
                    <div className="fcui2-slider-cursor" style={{left: x - 8}}></div>
                </div>
            );
        }
    });


    function value2x(value, props) {
        var margin = 10;
        var min = isNaN(props.min) ? 0 : props.min * 1;
        var max = isNaN(props.max) ? 100 : props.max * 1;
        var width = isNaN(props.width) ? 200 : props.width * 1;
        value = displayValue(value, props) * 1;
        if (min > max) {
            var tmp = min;
            min = max;
            max = tmp;
        }
        return margin + (value - min) * (width - margin * 2) / (max - min);
    }

    function displayValue(value, props) {
        var min = isNaN(props.min) ? 0 : props.min * 1;
        var max = isNaN(props.max) ? 100 : props.max * 1;
        value = isNaN(value) ? 0 : value * 1;
        if (min > max) {
            var tmp = min;
            min = max;
            max = tmp;
        }
        value = value < min ? min : value;
        value = value > max ? max : value;
        if (props.type === 'int') return parseInt(value, 10);
        var fixed = isNaN(props.fixed) ? 2 : parseInt(props.fixed, 10);
        value = parseFloat(value).toFixed(fixed);
        value += value.indexOf('.') < 0 ? ('.' + '0000000000000'.substr(0, fixed)) : '';
        return value;
    }

});
