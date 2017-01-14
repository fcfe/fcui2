/**
 * 颜色选择器
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2.2
 */
define(function (require) {


    var _ = require('underscore');
    var React = require('react');
    var NumberBox = require('./NumberBox.jsx');


    var InputWidget = require('./mixins/InputWidget');
    var tools = require('./core/colorPickerTools');
    var cTools = require('./core/componentTools');


    var defaultRGBprops = {
        min: 0,
        max: 255,
        type: 'int',
        step: 1,
        width: 80
    };


    var defaultHSLprops = {
        min: 0,
        max: 1,
        type: 'float',
        step: 0.01,
        fixed: 2,
        width: 80
    };


    return React.createClass({
        /**
         * @properties
         *
         * @param {Import|Properties} src\core\componentTools.js skin className style disabled
         * @param {Import|Properties} src\mixins\InputWidget.js
         *      value onChange name validations customErrorTemplates valueTemplate
         */
        /**
         * @fire Import src\mixins\InputWidget.js XXX onChange
         */
        /**
         * @structure ColorPickerValue
         * @example
         *  {
         *      css: <required>,
         *      rgb: <required>,
         *      hsl: <optional>
         *  }
         * @param {String} css 带#前缀的CSS颜色，六位十六进制数组成
         * @param {Array.<Int>} rgb RGB颜色
         * @param {Array.<Float>} hsl HSL颜色
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
                // mixin
                valueTemplate: JSON.stringify({
                    css: '#000000',
                    rgb: [0, 0, 0],
                    hsl: [0, 0, 0]
                })
            };
        },
        // @override
        getInitialState: function () {
            return {};
        },
        // @override
        componentDidMount: function () {
            this.renderColors();
        },
        // @override
        componentDidUpdate: function () {
            this.renderColors();
        },
        renderColors: function () {
            var value = tools.getValueObject(this.___getValue___());
            // 渲染大色块颜色
            var ctxLeft = this.refs.canvasLeft.getContext('2d');
            var lineGradientLeft = ctxLeft.createLinearGradient(231, 0, 0, 231);  
            lineGradientLeft.addColorStop(0, 'rgba(' + value.rgb.join(', ') + ', 1)');    
            lineGradientLeft.addColorStop(1, 'rgba(255, 255, 255, 1)');    
            ctxLeft.fillStyle = lineGradientLeft;    
            ctxLeft.fillRect(0, 0, 231, 231);
            // 渲染右侧颜色选择区
            var ctxRight = this.refs.canvasRight.getContext('2d');
            var lineGradientRight = ctxRight.createLinearGradient(1, 0, 1, 231);
            for (var n = 0; n < 256; n++) {
                var rgb = tools.HSL2RGB(n / 255, 1, 0.5);
                lineGradientRight.addColorStop(n / 255, tools.RGB2CSS(rgb[0], rgb[1], rgb[2]));
            }
            ctxRight.fillStyle = lineGradientRight;
            ctxRight.fillRect(0, 0, 10, 231); 
            ctxRight.stroke();
        },
        onCanvasClick: function (e) {
            var x = e.nativeEvent.offsetX;
            var y = e.nativeEvent.offsetY;
            var rgb = e.target.getContext('2d').getImageData(x, y, 1, 1).data;
            var value = tools.getValueObject(this.___getValue___());
            value.rgb = [rgb[0], rgb[1], rgb[2]];
            value.css = tools.RGB2CSS(rgb[0], rgb[1], rgb[2]);
            value.hsl = tools.RGB2HSL(rgb[0], rgb[1], rgb[2]);
            e.target = this.refs.container;
            e.target.value = JSON.stringify(value);
            this.___dispatchChange___(e);
        },
        numberBoxChangeHandlerFactory: function (field, index) {
            var me = this;
            return function (e) {
                var value = tools.getValueObject(me.___getValue___());
                var newValue = e.target.value;
                if (field === 'rgb' || (field !== 'rgb' && newValue.charAt(newValue.length - 1) !== '.')) {
                    newValue = +newValue;
                }
                value[field][index] = newValue;
                if (typeof newValue !== 'string') {
                    if (field === 'rgb') {
                        value.css = tools.RGB2CSS(value.rgb[0], value.rgb[1], value.rgb[2]);
                        value.hsl = tools.RGB2HSL(value.rgb[0], value.rgb[1], value.rgb[2]);
                    }
                    else {
                        value.rgb = tools.HSL2RGB(value.hsl[0], value.hsl[1], value.hsl[2]);
                        value.css = tools.RGB2CSS(value.rgb[0], value.rgb[1], value.rgb[2]);
                    }
                }
                e.target = me.refs.container;
                e.target.value = JSON.stringify(value);
                me.___dispatchChange___(e);
            };
        },
        render: function () {
            var value = tools.getValueObject(this.___getValue___());
            var canvasLeftProps = {
                ref: 'canvasLeft',
                width: 231,
                height: 231,
                className: 'canvas-left',
                onClick: this.onCanvasClick
            };
            var canvasRightProps = {
                ref: 'canvasRight',
                width: 10,
                height: 231,
                className: 'canvas-right',
                onClick: this.onCanvasClick
            };
            var labelStyle = {
                backgroundColor: value.css,
                width:80,
                height: 30,
                marginLeft: 11
            };
            var rProps = _.extend({}, defaultRGBprops, {
                value: value.rgb[0],
                onChange: this.numberBoxChangeHandlerFactory('rgb', 0)
            });
            var gProps = _.extend({}, defaultRGBprops, {
                value: value.rgb[1],
                onChange: this.numberBoxChangeHandlerFactory('rgb', 1)
            });
            var bProps = _.extend({}, defaultRGBprops, {
                value: value.rgb[2],
                onChange: this.numberBoxChangeHandlerFactory('rgb', 2)
            });
            var hProps = _.extend({}, defaultHSLprops, {
                value: value.hsl[0],
                onChange: this.numberBoxChangeHandlerFactory('hsl', 0)
            });
            var sProps = _.extend({}, defaultHSLprops, {
                value: value.hsl[1],
                onChange: this.numberBoxChangeHandlerFactory('hsl', 1)
            });
            var lProps = _.extend({}, defaultHSLprops, {
                value: value.hsl[2],
                onChange: this.numberBoxChangeHandlerFactory('hsl', 2)
            });
            return (
                <div {...cTools.containerBaseProps('colorpicker', this)}>
                    <canvas {...canvasLeftProps}></canvas>
                    <canvas {...canvasRightProps}></canvas>
                    <div className="input-container">
                        <div><span>R</span><NumberBox {...rProps}/></div>
                        <div><span>G</span><NumberBox {...gProps}/></div>
                        <div><span>B</span><NumberBox {...bProps}/></div>
                        <hr/>
                        <div><span>H</span><NumberBox {...hProps}/></div>
                        <div><span>S</span><NumberBox {...sProps}/></div>
                        <div><span>L</span><NumberBox {...lProps}/></div>
                        <div style={labelStyle}></div>
                    </div>
                </div>
            );
        }
    });

});
