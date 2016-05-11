/**
 * @file 文本域组件
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.1
 */
define(function (require) {


    var React = require('react');
    var InputWidgetBase = require('./mixins/InputWidgetBase');
    var InputWidgetInForm = require('./mixins/InputWidgetInForm');


    return React.createClass({
        // @override
        mixins: [InputWidgetBase, InputWidgetInForm],
        // @override
        getDefaultProps: function () {
            return {
                className: '',
                width: 200,
                height: 100,
                placeholder: '',
                disabled: false,
                valueTemplate: ''
            };
        },
        // @override
        componentWillReceiveProps: function (nextProps) {
            // 注意，此处不符合fcui2开发规范，主要是为了解决https://github.com/facebook/react/issues/3926这个问题
            if (nextProps.value === this.state.___value___) return;
            this.setState({
                ___value___: nextProps.value
            });
        },
        // @override
        getInitialState: function () {
            return {
                ___value___: this.props.value
            };
        },
        changeHandler: function (e) {
            if (this.props.disabled) return;
            this.___dispatchChange___(e);
        },
        focus: function () {
            this.refs.inputbox.focus();
        },
        render: function () {
            var value = this.state.___value___;
            var containerProp = {
                className: 'fcui2-textarea ' + this.props.className,
                style: {
                    width: this.props.width,
                    height: this.props.height
                }
            };
            var labelProp = {
                style: {
                    visibility: value && value.length ? 'hidden' : 'visible'
                }
            };
            var inputProp = {
                value: value,
                onChange: this.changeHandler,
                ref: 'inputbox',
                disabled: this.props.disabled,
                spellCheck: false,
                style: {// 其实不应该这样写，可是textarea的padding和border会导致整体尺寸变大
                    width: this.props.width - 22,
                    height: this.props.height - 22
                }
            };
            this.___mergeInputHandlers___(inputProp, this.props);
            if (this.props.disabled) {
                containerProp.className += ' fcui2-textarea-disabled'
            }
            else if (this.state.isValid === false) {
                containerProp.className += ' fcui2-textarea-reject'
            }
            return (
                <div {...containerProp}>
                    <div {...labelProp}>{this.props.placeholder}</div>
                    <textarea {...inputProp}/>
                </div>
            );
        }
    });
});
