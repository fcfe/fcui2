/**
 * 行号文本域
 * @author Hao Cuicui
 * @version 0.0.2.1
 */
define(function (require) {

    var React = require('react');
    var InputWidget = require('./mixins/InputWidget');
    var InputWidgetImeFixed = require('./mixins/InputWidgetImeFixed');
    var InputWidgetImeFixedForPreactIE = require('./mixins/InputWidgetImeFixedForPreactIE');
    var cTools = require('./core/componentTools');
    var util = require('./core/util');

    var isPreactAndIE = typeof React.render === 'function' && util.getBrowserEnterprise() === 'ie';

    return React.createClass({
        /**
         * @properties
         *
         * @param {Import|Properties} src\core\componentTools.js skin className style disabled
         * @param {String} placeholder 文本域中无内容时显示的提示文字
         * @param {Function} onFocus 输入框获取焦点后的回调
         * @param {Function} onBlur 输入框失去焦点后的回调
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
        mixins: isPreactAndIE ? [InputWidget, InputWidgetImeFixedForPreactIE] : [InputWidget, InputWidgetImeFixed],
        // @override
        getDefaultProps: function getDefaultProps() {
            return {
                // base
                skin: '',
                className: '',
                style: {},
                disabled: false,
                // self
                placeholder: '',
                // mixin
                valueTemplate: ''
            };
        },
        // @override
        getInitialState: function getInitialState() {
            return {
                hasFocus: false,
                lineHeight: '20px',
                paddingTop: '10px'
            };
        },
        // @override
        componentDidMount: function componentDidMount() {
            var me = this;
            var tarNode = me.refs.inputbox;
            var numNode = me.refs.numbox;
            var paddingTop = util.getStyle(tarNode, 'paddingTop');
            var lineHeight = util.getStyle(tarNode, 'lineHeight');
            if (this.state.lineHeight !== lineHeight) {
                this.setState({ lineHeight: lineHeight });
            }
            if (this.state.paddingTop !== paddingTop) {
                this.setState({ paddingTop: paddingTop });
            }
            clearInterval(me.___timerClick___);
            me.___timerClick___ = window.setInterval(function () {
                if (!me.refs || !me.refs.inputbox) {
                    clearInterval(me.___timerClick___);
                    return;
                }
                var scrollTop = tarNode.scrollTop;
                numNode.style.top = -scrollTop + 'px';
            }, 20);
        },
        // @override
        componentWillUnmount: function componentWillUnmount() {
            clearInterval(this.___timerClick___);
        },
        /**
         * 让文本域获得焦点
         * @interface focus
         */
        focus: function focus() {
            this.refs.inputbox.focus();
            this.setState({ hasFocus: true });
        },
        render: function render() {
            var value = this.___getValue___();
            value = value === undefined || value == null ? '' : value;
            var width = cTools.getValueFromPropsAndStyle(this.props, 'width', 400);
            var height = cTools.getValueFromPropsAndStyle(this.props, 'height', 80);
            width = isNaN(width) ? 400 : +width;
            height = isNaN(height) ? 100 : +height;
            var containerProp = cTools.containerBaseProps('textline', this, {
                merge: {
                    'data-type': this.props.type
                },
                style: {
                    width: width,
                    height: height
                }
            });
            var inputProp = {
                ref: 'inputbox',
                disabled: this.props.disabled,
                spellCheck: false,
                wrap: 'off',
                // 其实不应该这样写，可是textarea的padding和border会导致整体尺寸变大
                style: {
                    width: width - 50,
                    height: height - 20
                }
            };
            if (isPreactAndIE) {
                util.extend(inputProp, {
                    onCompositionStart: this.___onCompositionStart___,
                    onCompositionEnd: this.___onCompositionEnd___,
                    onKeyUp: this.___onKeyUp___,
                    onFocus: this.___onFocus___,
                    onBlur: this.___onBlur___
                });
            } else {
                util.extend(inputProp, {
                    onCompositionStart: this.___onCompositionStart___,
                    onCompositionEnd: this.___onCompositionEnd___,
                    onKeyUp: this.___onKeyUp___,
                    onFocus: this.___onFocus___,
                    onBlur: this.___onBlur___,
                    onInput: this.___onInput___
                });
            }
            // 由于IE和Chrome下placeholder表现不一致，所以自己做IE下得到焦点后，placeholder会消失，chrome不会
            var hidePlaceHolder = value && value.length || this.state.hasFocus;
            var labelProp = {
                className: 'placeholder',
                style: {
                    visibility: hidePlaceHolder ? 'hidden' : 'visible',
                    paddingTop: this.state.paddingTop,
                    lineHeight: this.state.lineHeight
                },
                dangerouslySetInnerHTML: {
                    __html: this.props.placeholder
                }
            };
            var numProp = {
                ref: 'numbox',
                className: 'numbox',
                style: {
                    paddingTop: this.state.paddingTop
                }
            };
            var skin = (this.context.appSkin ? this.context.appSkin + '-' : '') + (this.props.skin ? this.props.skin : 'normal');
            containerProp.className += this.state.hasFocus ? ' fcui2-textline-' + skin + '-hover' : '';
            return React.createElement(
                'div',
                containerProp,
                React.createElement('div', labelProp),
                React.createElement('textarea', inputProp),
                React.createElement(
                    'div',
                    numProp,
                    hidePlaceHolder ? renderNumer(this) : null
                )
            );
        }
    });

    function renderNumer(me) {
        var doms = [];
        var value = me.___getValue___();
        var lineHeight = me.state.lineHeight;
        value = value === undefined || value == null ? '' : value;
        if (typeof value !== 'string') {
            return;
        }
        value = value.split('\n');
        for (var i = 0; i < value.length; i++) {
            var numProp = {
                key: 'no-' + i,
                className: 'numitem',
                style: {
                    lineHeight: lineHeight,
                    height: lineHeight
                }
            };
            doms.push(React.createElement(
                'div',
                numProp,
                i + 1
            ));
        }
        return doms;
    }
});