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
            if (
                (
                    nextProps.value + '' === this.state.___value___ + ''
                    && this.refs.inputbox && nextProps.value + '' === this.refs.inputbox.value + ''
                )
                || nextProps.value === undefined
                || nextProps.value === null
            ) {
                return;
            }
            this.setState({
                ___value___: nextProps.value
            });
        },
        // @override
        getInitialState: function () {
            var value = this.props.value;
            value = value === undefined || value === null ? '' : value + '';
            return {
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
            var width = cTools.getValueFromPropsAndStyle(this.props, 'width', 400);
            var height = cTools.getValueFromPropsAndStyle(this.props, 'height', 300);
            width = isNaN(width) ? 400 : +width;
            height = isNaN(height) ? 300 : +height;
            var containerProp = cTools.containerBaseProps('textarea', this, {
                style: {
                    width: width,
                    height: height
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
                    width: width - 22,
                    height: height - 22
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
