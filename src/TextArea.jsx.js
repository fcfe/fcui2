/**
 * @file 文本域组件
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
            if (nextProps.value === this.state.___value___ || !nextProps.value) return;
            this.setState({
                ___value___: nextProps.value
            });
        },
        // @override
        getInitialState: function () {
            var width = this.props.width;
            width = isNaN(width) && this.props.hasOwnProperty('style')
                && !isNaN(width) ? this.props.style.width: width;
            width = isNaN(width) ? 200 : width;
            var height = this.props.height;
            height = isNaN(height) && this.props.hasOwnProperty('style')
                && !isNaN(height) ? this.props.style.height: height;
            height = isNaN(height) ? 100 : height;
            return {
                width: width,
                height: height,
                ___value___: this.props.value || ''
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
            var containerProp = cTools.containerBaseProps('textarea', this, {
                style: {
                    width: this.state.width,
                    height: this.state.height
                }
            })
            var inputProp = {
                ref: 'inputbox',
                value: value,
                onChange: this.onChange,
                disabled: this.props.disabled,
                spellCheck: false,
                // 其实不应该这样写，可是textarea的padding和border会导致整体尺寸变大
                style: {
                    width: this.state.width - 22,
                    height: this.state.height - 22
                }
            };
            // 由于IE和Chrome下placeholder表现不一致，所以自己做。IE下得到焦点后，placeholder会消失，chrome不会。
            var labelProp = {
                style: {
                    visibility: value && value.length ? 'hidden' : 'visible'
                }
            };
            return (
                <div {...containerProp}>
                    <div {...labelProp}>{this.props.placeholder}</div>
                    <textarea {...inputProp}/>
                </div>
            );
        }
    });
});
