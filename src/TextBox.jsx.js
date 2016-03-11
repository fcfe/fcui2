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
                disable: false,
                valueTemplate: '' // 值的模板，当用户不通过value和valueLink传入值控制时，根据此项在state中保存临时操作值
            };
        },
        // @override
        getInitialState: function () {
            return {};
        },
        changeHandler: function (e) {
            if (this.props.disable) return;
            this.___dispatchChange___(e);
        },
        focus: function () {
            this.refs.inputbox.focus();
        },
        render: function () {
            var value = this.___getValue___();
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
            if (this.props.disable) {
                containerProp.className += ' fcui2-textbox-disable'
            }
            else if (this.state.isValid === false) {
                containerProp.className += ' fcui2-textbox-reject'
            }
            return (
                <div {...containerProp}>
                    <div {...placeholderProp}>{this.props.placeholder}</div>
                    <input {...inputProp} disabled={this.props.disable} ref="inputbox"/>
                </div>
            );
        }
    });
});
