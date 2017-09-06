/**
 * 栅格形式的色彩选择器
 * @author Wang Yi
 * @email wangyispaceman@gmail.com
 * @version 0.0.2.2
 */
define(function (require) {
    var React = require('react');
    var InputWidget = require('./mixins/InputWidget');
    var cTools = require('./core/componentTools');
    var tools = require('./core/colorPickerTools');
    var Layer = require('./Layer.jsx');
    var NormalRenderer = require('./components/colorgrid/NormalRenderer.jsx');
    var factory = require('./factories/colorGridFactory.jsx');

    return React.createClass({
        /**
         * @properties
         *
         * @param {Import|Properties} src\core\componentTools.js skin className style disabled
         * @param {Array.<String>} colors 可选择的颜色集合，以#为前缀的CSS色值，六位十六进制数组成
         * @param {ReactClass} renderer 组件主体部分渲染器
         * @param {String} layerLocation 浮层的定位配置，具体见src\core\layerTools.js
         * @param {Import|Properties} src\mixins\InputWidget.js
         *     value onChange name validations customErrorTemplates valueTemplate
         */
        /**
         * @fire Import src\mixins\InputWidget.js XXX onChange
         */
        /**
         * @structure ColorGridValue
         * @example
         *  {
         *      hex: <required>,
         *      rgb: <optional>
         *  }
         * @param {String} hex 带#前缀的CSS颜色，六位十六进制数组成
         * @param {Object} rgb RGB颜色
         * @param {Number} rgb.r 红色通道色值
         * @param {Number} rgb.g 绿色通道色值
         * @param {Number} rgb.b 蓝色通道色值
         */
        mixins: [InputWidget],
        getDefaultProps: function () {
            return {
                // base
                skin: '',
                className: '',
                style: {},
                disabled: false,
                // self
                colors: [],
                renderer: NormalRenderer,
                layerLocation: 4,
                // mixin
                valueTemplate: JSON.stringify({
                    hex: '#F35A59',
                    rgb: {
                        r: 243,
                        g: 90,
                        b: 89
                    }
                })
            };
        },

        getInitialState: function () {
            return {
                isLayerOpen: false
            };
        },

        onMainClick: function () {
            this.setState({
                isLayerOpen: true
            });
        },

        onColorClick: function (data, e) {
            var hex = data.color;
            var rgbArray = tools.CSS2RGB(hex);
            e = {target: this.refs.container};
            e.target.value = JSON.stringify({
                hex: hex,
                rgb: {
                    r: rgbArray[0],
                    g: rgbArray[1],
                    b: rgbArray[2]
                }
            });
            this.___dispatchChange___(e);
            this.setState({
                isLayerOpen: false
            });
        },

        onCancelClick: function () {
            this.setState({
                isLayerOpen: false
            });
        },

        render: function () {
            var value = JSON.parse(this.___getValue___());
            var containerProps = cTools.containerBaseProps('colorgrid', this, {
                merge: {
                    onClick: this.onMainClick
                }
            });
            var layerProps = {
                isOpen: this.state.isLayerOpen && !this.props.disabled,
                anchor: this.refs.container,
                location: this.props.layerLocation,
                closeWithBodyClick: true,
                onCloseByWindow: this.onCancelClick,
                skin: this.context.appSkin ? (this.context.appSkin + '-normal') : 'normal',
                style: {
                    width: 213,
                    height: 118
                }
            };
            var Renderer = typeof this.props.renderer === 'function' ? this.props.renderer : NormalRenderer;
            return (
                <div {...containerProps}>
                    <Renderer value={this.___getValue___()} disabled={this.props.disabled} />
                    <Layer {...layerProps}>
                        {factory.colorGridFactory(this)}
                    </Layer>
                </div>
            );
        }
    });
});