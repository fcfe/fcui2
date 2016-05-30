/**
 * @file 数字输入框组件
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2
 */
define(function (require) {


    var React = require('react');
    var InputWidget = require('./mixins/InputWidget');


    var util = require('./core/util');
    var cTools = require('./core/componentTools');
    var tools = require('./core/numberboxTools');


    return React.createClass({
        // @override
        mixins: [InputWidget],
        // @override
        getDefaultProps: function () {
            return {
                skin: '',
                className: '',
                style: {},
                disabled: false,
                max: Number.POSITIVE_INFINITY,
                min: Number.NEGATIVE_INFINITY,
                step: 1.00,
                type: 'float', // int, float
                fixed: Number.POSITIVE_INFINITY,
                showSpinButton: true,
                valueTemplate: ''
            };
        },
        // @override
        getInitialState: function () {
            return {};
        },
        // @override
        componentDidMount: function () {
            this.___cursorPosition___ = -1;
            var containerWidth = this.refs.container.offsetWidth;
            this.refs.inputbox.style.width = (containerWidth - (this.props.showSpinButton ? 40 : 20) - 2) + 'px';
        },
        // @override
        componentDidUpdate: function () {
            if (this.___cursorPosition___ < 0) return;
            var offset = this.___valueWhenKeyDown___ === this.refs.inputbox.value ? 0 : 1;
            util.setCursorPosition(this.refs.inputbox, this.___cursorPosition___ + offset);
        },
        onInputBoxChange: function (e) {
            if (this.props.disabled) return;
            e.target.value = tools.numberFormater(e.target.value, this.props);
            this.___dispatchChange___(e);
        },
        onInputBoxKeyDown: function (e) {
            this.___valueWhenKeyDown___ = e.target.value;
            this.___cursorPosition___ = util.getCursorPosition(e.target);
        },
        onInputBoxBlur: function () {
            this.___cursorPosition___ = -1;
        }, 
        onSpinButtonClick: function (e) {
            if (
                this.props.disabled
                || isNaN(this.refs.inputbox.value)
                || this.refs.inputbox.value.length === 0
            ) {
                return;
            }
            var dataset = util.getDataset(e.target);
            var op = dataset.uiCmd === 'add' ? 1 : -1;
            var target = this.refs.inputbox;
            var value = parseFloat(target.value);
            target.value = value + op * parseFloat(this.props.step);
            e.target = target;
            this.___dispatchChange___(e);
        },
        focus: function () {
            this.refs.inputbox.focus();
        },
        render: function () {
            var value = this.___getValue___();
            var containerProp = cTools.containerBaseProps('numberbox', this, {});
            var inputProp = {
                ref: 'inputbox',
                type: 'text',
                value: tools.numberFormater(value, this.props),
                onChange: this.onInputBoxChange,
                onKeyDown: this.onInputBoxKeyDown,
                onBlur: this.onInputBoxBlur
            };
            var btnContainerProp = {
                className: 'btn-container',
                style: {
                    top: util.isIE() ? 0 : 1, // 实在不知道怎么在CSS里面hack了。
                    display: this.props.showSpinButton ? 'block' : 'none'
                }
            };
            return (
                <div {...containerProp}>
                    <input {...inputProp} disabled={this.props.disabled} ref="inputbox"/>
                    <div {...btnContainerProp}>
                        <div className="font-icon font-icon-largeable-caret-up"
                            data-ui-cmd="add" onClick={this.onSpinButtonClick}></div>
                        <div className="font-icon font-icon-largeable-caret-down"
                            data-ui-cmd="sub" onClick={this.onSpinButtonClick}></div>
                    </div>
                </div>
            );
        }
    });

});
