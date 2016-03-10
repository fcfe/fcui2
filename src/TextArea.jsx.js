/**
 * @file 文本域组件
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.1
 */
define(function (require) {


    var React = require('react');
    var InputWidgetBase = require('./mixins/InputWidgetBase');


    return React.createClass({
        // @override
        mixins: [InputWidgetBase],
        // @override
        getDefaultProps: function () {
            return {
                className: '',
                width: 200,
                height: 100,
                placeholder: '',
                disable: false,
                valueTemplate: ''
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
                disabled: this.props.disable,
                spellCheck: false,
                style: {// 其实不应该这样写，可是textarea的padding和border会导致整体尺寸变大
                    width: this.props.width - 22,
                    height: this.props.height - 22
                }
            };
            this.___mergeInputHandlers___(inputProp, this.props);
            if (this.props.disable) {
                containerProp.className += ' fcui2-textarea-disable'
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
