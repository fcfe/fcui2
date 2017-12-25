var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/**
 * 数字输入框
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2.1
 */
define(function (require) {

    var React = require('react');
    var InputWidget = require('./mixins/InputWidget');

    var util = require('./core/util');
    var cTools = require('./core/componentTools');
    var tools = require('./core/numberboxTools');

    return React.createClass({
        /**
         * @properties
         *
         * @param {Import|Properties} src\core\componentTools.js skin className style disabled
         * @param {String} placeholder 数字输入框中无内容时显示的提示文字
         * @param {Number} max 允许输入的最大值
         * @param {Number} min 允许输入的最小值
         * @param {Number} step 调节按钮点击时值跳动的步频
         * @param {String} type 输入数字的类型，float或int
         * @param {Number} fixed 保留的小数位数，只有当type为float时有效
         * @param {Boolean} showSpinButton 是否显示调节按钮
         * @param {Import|Properties} src\mixins\InputWidget.js
         *      value onChange name validations customErrorTemplates valueTemplate
         */
        /**
         * @fire Import src\mixins\InputWidget.js XXX onChange
         */
        // @override
        contextTypes: {
            appSkin: React.PropTypes.string
        },
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
                // self
                width: 100,
                placeholder: '',
                max: Number.POSITIVE_INFINITY,
                min: Number.NEGATIVE_INFINITY,
                step: 1.00,
                type: 'float', // int, float
                fixed: Number.POSITIVE_INFINITY,
                showSpinButton: false,
                // mixin
                valueTemplate: ''
            };
        },
        // @override
        getInitialState: function getInitialState() {
            return {
                hasFocus: false
            };
        },
        // @override
        componentDidMount: function componentDidMount() {
            this.___cursorPosition___ = -1;
        },
        // @override
        componentDidUpdate: function componentDidUpdate() {
            if (this.___cursorPosition___ < 0) return;
            var offset = this.___valueWhenKeyDown___ === this.refs.inputbox.value ? 0 : 1;
            util.setCursorPosition(this.refs.inputbox, this.___cursorPosition___ + offset);
        },
        onInputBoxChange: function onInputBoxChange(e) {
            if (this.props.disabled) return;
            e.target.value = tools.numberFormater(e.target.value, this.props);
            this.___dispatchChange___(e);
        },
        onInputBoxKeyDown: function onInputBoxKeyDown(e) {
            this.___valueWhenKeyDown___ = e.target.value;
            this.___cursorPosition___ = util.getCursorPosition(e.target);
        },
        onInputBoxBlur: function onInputBoxBlur() {
            this.___cursorPosition___ = -1;
            this.setState({ hasFocus: false });
            typeof this.props.onBlur === 'function' && this.props.onBlur({
                target: this.refs.inputbox
            });
        },
        onSpinButtonClick: function onSpinButtonClick(e) {
            if (this.props.disabled || isNaN(this.refs.inputbox.value) || this.refs.inputbox.value.length === 0) {
                return;
            }
            var dataset = util.getDataset(e.target);
            var op = dataset.uiCmd === 'add' ? 1 : -1;
            var target = this.refs.inputbox;
            function change(a, b, c) {
                var sa = a + '';
                var sb = b + '';
                var pa = 0;
                var pb = 0;
                if (sa.indexOf('.') > 0) {
                    pa = sa.split('.')[1].length;
                }
                if (sb.indexOf('.') > 0) {
                    pb = sb.split('.')[1].length;
                }
                var fixed = Math.max(pa, pb);
                a = Number(a);
                b = Number(b);
                return +parseFloat(a + c * b).toFixed(fixed);
            }
            var newValue = change(target.value, this.props.step, op);
            target.value = tools.numberFormater(newValue, this.props);
            e = { target: target };
            this.___dispatchChange___(e);
        },
        /**
         * 让输入框获得焦点
         * @interface focus
         */
        focus: function focus() {
            this.refs.inputbox.focus();
            this.setState({ hasFocus: true });
        },
        onInputBoxFocus: function onInputBoxFocus() {
            this.setState({ hasFocus: true });
            typeof this.props.onFocus === 'function' && this.props.onFocus({
                target: this.refs.inputbox
            });
        },
        render: function render() {
            var value = this.___getValue___();
            value = tools.numberFormater(value, this.props);
            var width = cTools.getValueFromPropsAndStyle(this.props, 'width', 200);
            width = isNaN(width) ? 200 : +width;
            var containerProp = cTools.containerBaseProps('numberbox', this, {
                style: { width: width }
            });
            var placeholderProp = {
                className: 'fcui2-numberbox-placeholder',
                style: {
                    visibility: value.length === 0 ? 'visible' : 'hidden'
                }
            };
            var inputProp = {
                ref: 'inputbox',
                type: 'text',
                value: value,
                style: {
                    width: this.props.showSpinButton ? width - 42 : width - 22,
                    paddingLeft: 10,
                    paddingRight: this.props.showSpinButton ? 30 : 10
                },
                onFocus: this.onInputBoxFocus,
                onChange: this.onInputBoxChange,
                onKeyDown: this.onInputBoxKeyDown,
                onBlur: this.onInputBoxBlur
            };
            var btnContainerProp = {
                className: 'btn-container',
                style: {
                    display: this.props.showSpinButton ? 'block' : 'none'
                }
            };
            var skin = (this.context.appSkin ? this.context.appSkin + '-' : '') + (this.props.skin ? this.props.skin : 'normal');
            return React.createElement(
                'div',
                containerProp,
                React.createElement(
                    'div',
                    placeholderProp,
                    this.props.placeholder
                ),
                React.createElement('input', _extends({}, inputProp, { disabled: this.props.disabled, ref: 'inputbox' })),
                React.createElement(
                    'div',
                    btnContainerProp,
                    React.createElement('div', { className: 'fcui2-icon fcui2-icon-small-arrow-up',
                        'data-ui-cmd': 'add', onClick: this.onSpinButtonClick }),
                    React.createElement('div', { className: 'fcui2-icon fcui2-icon-small-arrow-down',
                        'data-ui-cmd': 'sub', onClick: this.onSpinButtonClick })
                )
            );
        }
    });
});