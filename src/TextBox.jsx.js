/**
 * @file 文本输入框组件
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
                placeholder: '',
                disabled: false,
                valueTemplate: '' // 值的模板，当用户不通过value和valueLink传入值控制时，根据此项在state中保存临时操作值
            };
        },
        // @override
        componentWillReceiveProps: function (nextProps) {
            // 注意，此处不符合fcui2开发规范，主要是为了解决https://github.com/facebook/react/issues/3926这个问题
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
            // 这里value仅用于显示，把它变成string是安全的。
            // 若维持原类型，下面placeholder的判定对于number类型的value会出问题。
            var value = this.state.___value___;
            var containerProp = {
                className: 'fcui2-textbox ' + this.props.className,
                style: {width: this.props.width}
            };
            var placeholderProp = {
                style: {
                    visibility: value && value.length ? 'hidden' : 'visible'
                }
            };
            var inputProp = {
                type: 'text',
                value: value,
                style: {width: this.props.width - 20},
                onChange: this.changeHandler
            };
            this.___mergeInputHandlers___(inputProp, this.props);
            if (this.props.disabled) {
                containerProp.className += ' fcui2-textbox-disabled'
            }
            else if (this.state.isValid === false) {
                containerProp.className += ' fcui2-textbox-reject'
            }
            return (
                <div {...containerProp}>
                    <div {...placeholderProp}>{this.props.placeholder}</div>
                    <input {...inputProp} disabled={this.props.disabled} ref="inputbox"/>
                </div>
            );
        }
    });
});
