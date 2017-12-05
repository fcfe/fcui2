/**
 * 颜色选择器
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2.2
 */
define(function (require) {

    var React = require('react');
    var NumberBox = require('./NumberBox.jsx');

    var InputWidget = require('./mixins/InputWidget');
    var tools = require('./core/colorPickerTools');
    var cTools = require('./core/componentTools');
    var util = require('./core/util');

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
        getDefaultProps: function getDefaultProps() {
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
        getInitialState: function getInitialState() {
            var value = tools.getValueObject(this.___getValue___());
            return {
                canvasLeftMainColor: value.rgb,
                cursorLeft: null,
                cursorRight: null
            };
        },
        // @override
        componentDidMount: function componentDidMount() {
            this.renderColors();
        },
        // @override
        componentDidUpdate: function componentDidUpdate() {
            this.renderColors();
        },
        renderColors: function renderColors() {
            var value = tools.getValueObject(this.___getValue___());
            // 渲染大色块颜色
            var canvasLeft = this.refs.canvasLeft;
            var ctxLeft = canvasLeft.getContext('2d');
            var lineGradientLeft = ctxLeft.createLinearGradient(canvasLeft.width, canvasLeft.height, 0, 0);
            lineGradientLeft.addColorStop(0, 'rgba(0, 0, 0, 1)');
            lineGradientLeft.addColorStop(0.5, 'rgba(' + this.state.canvasLeftMainColor.join(', ') + ', 1)');
            lineGradientLeft.addColorStop(1, 'rgba(255, 255, 255, 1)');
            ctxLeft.fillStyle = lineGradientLeft;
            ctxLeft.fillRect(0, 0, canvasLeft.width, canvasLeft.height);
            // 渲染右侧颜色选择区
            var canvasRight = this.refs.canvasRight;
            var ctxRight = canvasRight.getContext('2d');
            var lineGradientRight = ctxRight.createLinearGradient(1, 0, 1, canvasRight.height);
            for (var n = 0; n < 256; n++) {
                var rgb = tools.HSL2RGB(n / 255, 1, 0.5);
                lineGradientRight.addColorStop(n / 255, tools.RGB2CSS(rgb[0], rgb[1], rgb[2]));
            }
            ctxRight.fillStyle = lineGradientRight;
            ctxRight.fillRect(0, 0, canvasRight.width, canvasRight.height);
            ctxRight.stroke();
            // 渲染虚拟鼠标位置
            if (this.state.cursorLeft) {
                return;
            }
            var imgDataLeft = ctxLeft.getImageData(0, 0, canvasLeft.width, canvasLeft.height);
            var posLeft = { left: 0, top: 0 };
            for (var i = 0; i < imgDataLeft.data.length; i += 4) {
                if (Math.abs(imgDataLeft.data[i] - value.rgb[0]) <= 2 && Math.abs(imgDataLeft.data[i + 1] - value.rgb[1]) <= 2 && Math.abs(imgDataLeft.data[i + 2] - value.rgb[2]) <= 2) {
                    var p = i / 4;
                    posLeft.top = p % canvasLeft.width - 3;
                    posLeft.left = (p - posLeft.top) / canvasLeft.width - 3;
                    break;
                }
            }
            // 获取右侧渲染去value的位置
            var imgDataRight = ctxRight.getImageData(0, 0, canvasRight.width, canvasRight.height);
            var posRight = { left: 5, top: -100 };
            for (var i = 0; i < imgDataRight.data.length; i += 4) {
                if (Math.abs(imgDataRight.data[i] - value.rgb[0]) <= 2 && Math.abs(imgDataRight.data[i + 1] - value.rgb[1]) <= 2 && Math.abs(imgDataRight.data[i + 2] - value.rgb[2]) <= 2) {
                    var p = i / 4;
                    posRight.top = parseInt(p / canvasRight.width, 10) - 3;
                    posRight.left = 2;
                    break;
                }
            }
            this.setState({
                cursorLeft: posLeft,
                cursorRight: posRight
            });
        },
        onCanvasClick: function onCanvasClick(e) {
            var x = e.nativeEvent.offsetX;
            var y = e.nativeEvent.offsetY;
            var rgb = e.target.getContext('2d').getImageData(x, y, 1, 1).data;
            var value = tools.getValueObject(this.___getValue___());
            value.rgb = [rgb[0], rgb[1], rgb[2]];
            value.css = tools.RGB2CSS(rgb[0], rgb[1], rgb[2]);
            value.hsl = tools.RGB2HSL(rgb[0], rgb[1], rgb[2]);
            var pos = {};
            pos[e.target.className.indexOf('canvas-right') > -1 ? 'cursorRight' : 'cursorLeft'] = {
                left: e.target.className.indexOf('canvas-right') > -1 ? 2 : x - 3,
                top: y - 3
            };
            this.setState(pos);
            if (e.target.className.indexOf('canvas-right') > -1) {
                this.setState({
                    canvasLeftMainColor: value.rgb
                });
            }
            e = { target: this.refs.container };
            e.target.value = JSON.stringify(value);
            this.___dispatchChange___(e);
        },
        numberBoxChangeHandlerFactory: function numberBoxChangeHandlerFactory(field, index) {
            var me = this;
            return function (e) {
                var value = tools.getValueObject(me.___getValue___());
                var newValue = e.target.value;
                if (field === 'rgb' || field !== 'rgb' && newValue.charAt(newValue.length - 1) !== '.') {
                    newValue = +newValue;
                }
                value[field][index] = newValue;
                if (typeof newValue !== 'string') {
                    if (field === 'rgb') {
                        value.css = tools.RGB2CSS(value.rgb[0], value.rgb[1], value.rgb[2]);
                        value.hsl = tools.RGB2HSL(value.rgb[0], value.rgb[1], value.rgb[2]);
                    } else {
                        value.rgb = tools.HSL2RGB(value.hsl[0], value.hsl[1], value.hsl[2]);
                        value.css = tools.RGB2CSS(value.rgb[0], value.rgb[1], value.rgb[2]);
                    }
                }
                e = { target: me.refs.container };
                e.target.value = JSON.stringify(value);
                me.___dispatchChange___(e);
            };
        },
        render: function render() {
            var value = tools.getValueObject(this.___getValue___());
            var canvasLeftProps = {
                ref: 'canvasLeft',
                width: 200,
                height: 200,
                className: 'canvas-left',
                onClick: this.onCanvasClick
            };
            var canvasRightProps = {
                ref: 'canvasRight',
                width: 11,
                height: 200,
                className: 'canvas-right',
                onClick: this.onCanvasClick
            };
            var rProps = util.extend({}, defaultRGBprops, {
                value: value.rgb[0],
                onChange: this.numberBoxChangeHandlerFactory('rgb', 0)
            });
            var gProps = util.extend({}, defaultRGBprops, {
                value: value.rgb[1],
                onChange: this.numberBoxChangeHandlerFactory('rgb', 1)
            });
            var bProps = util.extend({}, defaultRGBprops, {
                value: value.rgb[2],
                onChange: this.numberBoxChangeHandlerFactory('rgb', 2)
            });
            var hProps = util.extend({}, defaultHSLprops, {
                value: value.hsl[0],
                onChange: this.numberBoxChangeHandlerFactory('hsl', 0)
            });
            var sProps = util.extend({}, defaultHSLprops, {
                value: value.hsl[1],
                onChange: this.numberBoxChangeHandlerFactory('hsl', 1)
            });
            var lProps = util.extend({}, defaultHSLprops, {
                value: value.hsl[2],
                onChange: this.numberBoxChangeHandlerFactory('hsl', 2)
            });
            var cursor1Style = {
                left: this.state.cursorLeft ? this.state.cursorLeft.left + 10 : -100,
                top: this.state.cursorLeft ? this.state.cursorLeft.top + 10 : -100,
                borderColor: tools.RGB2CSS(255 - value.rgb[0], 255 - value.rgb[1], 255 - value.rgb[2])
            };
            var cursor2Style = {
                left: this.state.cursorRight ? this.state.cursorRight.left + 216 : -100,
                top: this.state.cursorRight ? this.state.cursorRight.top + 10 : -100,
                borderColor: tools.RGB2CSS(255 - value.rgb[0], 255 - value.rgb[1], 255 - value.rgb[2])
            };
            return React.createElement(
                'div',
                cTools.containerBaseProps('colorpicker', this),
                React.createElement('canvas', canvasLeftProps),
                React.createElement('canvas', canvasRightProps),
                React.createElement(
                    'div',
                    { className: 'input-container' },
                    React.createElement(
                        'div',
                        null,
                        React.createElement(
                            'span',
                            null,
                            'R'
                        ),
                        React.createElement(NumberBox, rProps)
                    ),
                    React.createElement(
                        'div',
                        null,
                        React.createElement(
                            'span',
                            null,
                            'G'
                        ),
                        React.createElement(NumberBox, gProps)
                    ),
                    React.createElement(
                        'div',
                        null,
                        React.createElement(
                            'span',
                            null,
                            'B'
                        ),
                        React.createElement(NumberBox, bProps)
                    ),
                    React.createElement('hr', null),
                    React.createElement(
                        'div',
                        null,
                        React.createElement(
                            'span',
                            null,
                            'H'
                        ),
                        React.createElement(NumberBox, hProps)
                    ),
                    React.createElement(
                        'div',
                        null,
                        React.createElement(
                            'span',
                            null,
                            'S'
                        ),
                        React.createElement(NumberBox, sProps)
                    ),
                    React.createElement(
                        'div',
                        null,
                        React.createElement(
                            'span',
                            null,
                            'L'
                        ),
                        React.createElement(NumberBox, lProps)
                    )
                ),
                React.createElement('div', { style: cursor2Style, className: 'virtual-cursor' }),
                React.createElement('div', { style: cursor1Style, className: 'virtual-cursor' })
            );
        }
    });
});