/**
 * 提示
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2.2
 */
define(function (require) {


    var React = require('react');
    var util = require('./core/util');
    var Layer = require('./Layer.jsx');
    var cTools = require('./core/componentTools');


    return React.createClass({
        /**
         * @properties
         * @param {Import|Properties} src\core\componentTools.js skin className style disabled
         * @param {String} title 弹出提示的标题
         * @param {String} content 弹出提示的内容，可以含有html标签
         * @param {String} icon 提示组件外部显示的图标，具体见src/css/icon/variable.less
         * @param {ReactClass} renderer Tip内部渲染的组件，如果指定，icon属性无效
         * @param {Object} renderProps Tip内部组件渲染的属性集
         * @param {String} layerLocation 浮层的定位配置，具体见src\core\layerTools.js
         * @param {Function} onOffset 浮层位置修正回调
         */
        /**
         * @fire Import src\Layer.jsx.js layer onOffset
         */
        // @override
        contextTypes: {
            appSkin: React.PropTypes.string
        },
        // @override
        getDefaultProps: function () {
            return {
                // base
                skin: '',
                className: '',
                style: {},
                disabled: false,
                // self
                title: '',
                content: '',
                icon: 'font-icon-hint-question-s',
                renderer: null,
                renderProps: {},
                layerLocation: 'right left top bottom',
                onOffset: null
            };
        },
        getInitialState: function () {
            return {
                layerOpen: false,
                mouseenter: false
            };
        },
        onMouseEnter: function () {
            this.setState({
                mouseenter: true,
                layerOpen: true
            });
        },
        onMouseLeave: function () {
            this.setState({mouseenter: false});
            cTools.closeLayerHandlerFactory(this, 'layerOpen')();
        },
        offsetLayerPosition: function (result) {
            if (typeof this.props.onOffset === 'function') {
                this.props.onOffset(result);
                return;
            }
            if (typeof this.props.renderer === 'function') return;
            result.left += '1_6_'.indexOf(result.clockPosition + '_') > -1 ? 10 : -15;
            result.top += '12_1_'.indexOf(result.clockPosition + '_') > -1  ? -5 : 10;
        },
        render: function () {
            var containerProp = cTools.containerBaseProps('tip', this, {
                merge: {
                    onMouseEnter: this.onMouseEnter,
                    onMouseLeave: this.onMouseLeave
                },
                style: (this.props.title || this.props.content) ? undefined : {display: 'none'}
            });
            var skin = (this.context.appSkin ? this.context.appSkin + '-' : '')
                    + (this.props.skin ? this.props.skin : 'normal');
            var layerProp = {
                ref: 'layer',
                isOpen: this.state.layerOpen && (this.props.title || this.props.content) && !this.props.disabled,
                anchor: this.refs.container,
                location: this.props.layerLocation,
                onOffset: this.offsetLayerPosition,
                onMouseLeave: this.onMouseLeave,
                skin: skin === 'oneux3-normal' ? 'normal' : skin
            };
            var Renderer = this.props.renderer;
            containerProp.className += typeof Renderer === 'function' ? '' : ' font-icon ' + this.props.icon;
            return (
                <div {...containerProp}>
                    {typeof Renderer === 'function' ? <Renderer {...this.props.renderProps}/> : null}
                    <Layer {...layerProp}>
                        <div className={'fcui2-tip-layer'}>
                            <div className="tip-title">{this.props.title}</div>
                            <div className="tip-content" dangerouslySetInnerHTML={{__html: this.props.content}}></div>
                        </div>
                    </Layer>
                </div>
            );
        }
    });


});
