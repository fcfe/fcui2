/**
 *  数字输入框组件
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
                placeholder: '',
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
            if (this.props.disabled || isNaN(this.refs.inputbox.value) || this.refs.inputbox.value.length === 0) {
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
            value = tools.numberFormater(value, this.props);
            var width = cTools.getValueFromPropsAndStyle(this.props, 'width', 200);
            width = isNaN(width) ? 200 : +width;
            var containerProp = cTools.containerBaseProps('numberbox', this, {
                style: {width: width}
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
                // 因为怎么用CSS定位，在Chrome和IE下显示都不一致，所以用最原始的方式组织DOM，然后用js计算尺寸
                style: {
                    height: 26,
                    width: this.props.showSpinButton ? (width - 42) : (width - 22),
                    paddingLeft: 10,
                    paddingRight: this.props.showSpinButton ? 30 : 10
                },
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
            return (
                <div {...containerProp}>
                    <div {...placeholderProp}>{this.props.placeholder}</div>
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
