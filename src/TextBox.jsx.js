/**
 * @file 文本输入框组件
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2
 */
define(function (require) {


    var React = require('react');
    var InputWidget = require('./mixins/InputWidget');
    var cTools = require('./core/componentTools');


    return React.createClass({
        // @override
        mixins: [InputWidget],
        // @override
        getDefaultProps: function () {
            return {
                // 样式属性
                skin: '',
                className: '',
                style: {},
                disabled: false,
                placeholder: '',
                valueTemplate: ''
            };
        },
        // @override
        componentWillReceiveProps: function (nextProps) {
            // 注意，此处不符合fcui2开发规范，主要是为了解决https://github.com/facebook/react/issues/3926这个问题
            if (
                nextProps.value + '' === this.state.___value___ + ''
                || nextProps.value === undefined
                || nextProps.value === null
            ) {
                return;
            }
            this.setState({
                ___value___: nextProps.value + ''
            });
        },
        // @override
        getInitialState: function () {
            var value = this.props.value;
            value = value === undefined || value === null ? '' : value + '';
            var width = this.props.width;
            width = isNaN(width) && this.props.hasOwnProperty('style')
                && !isNaN(width) ? this.props.style.width: width;
            width = isNaN(width) ? 200 : width;
            return {
                width: width,
                ___value___: value
            };
        },
        onChange: function (e) {
            if (this.props.disabled) return;
            this.___dispatchChange___(e);
        },
        focus: function () {
            this.refs.inputbox.focus();
        },
        render: function () {
            var value = this.state.___value___;
            var containerProp = cTools.containerBaseProps('textbox', this, {
                style: {width: this.state.width}
            });
            var placeholderProp = {
                style: {
                    visibility: value && value.length ? 'hidden' : 'visible'
                }
            };
            var inputProp = {
                type: 'text',
                value: value,
                style: {width: this.state.width - 20},
                onChange: this.onChange
            };
            return (
                <div {...containerProp}>
                    <div {...placeholderProp}>{this.props.placeholder}</div>
                    <input {...inputProp} disabled={this.props.disabled} ref="inputbox"/>
                </div>
            );
        }
    });
});
