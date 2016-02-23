define(function (require) {

    var React = require('react');
    var mixins = require('./core/mixins.jsx');

    return React.createClass({
        // @override
        mixins: [mixins.formField],
        // @override
        getDefaultProps: function () {
            return {
                className: '',
                width: 200,
                height: 100,
                label: '',  // 输入框下方的输入提示
                value: '',  // 初始value
                disable: false,
                checkout: [],   // 校验队列
                onChange: function () {},
                form: {},   // 父form component
                formField: '', // 本输入的域名称
                formFeedback: '' // 错误的提示框
            };
        },
        // @override
        getInitialState: function () {
            return {
                label: this.props.label,
                disable: this.props.disable,
                value: this.props.value,
                checkPassed: true, // 是否通过校验
                checkMessage: '',    // 检验错误提示
                changed: false      // 是否已经改变过了
            };
        },
        // @override
        componentWillReceiveProps: function (props) {
            this.setState({
                label: props.label,
                disable: props.disable
            });
        },
        changeHandler: function (e) {
            if (this.state.disable) return;
            var evt = {
                target: this,
                value: e.target.value,
                check: this.checkValue(e.target.value)
            };
            this.props.onChange(evt);
            this.setState({
                value: e.target.value,
                checkPassed: evt.check === true ? true : false,
                checkMessage: evt.check,
                changed: true
            });
            e.stopPropagation();
        },
        focus: function () {
            this.refs.inputbox.focus();
        },
        render: function () {
            var containerProp = {
                className: 'fcui2-textarea ' + this.props.className,
                style: {
                    width: this.props.width,
                    height: this.props.height
                }
            };
            var labelProp = {
                style: {
                    visibility: this.state.value.length ? 'hidden' : 'visible'
                }
            };
            var inputProp = {
                value: this.state.value,
                onChange: this.changeHandler,
                ref: 'inputbox',
                disabled: this.state.disable,
                spellCheck: false,
                style: {
                    width: this.props.width - 22,
                    height: this.props.height - 22 // 其实不应该这样写，可是textarea的padding和border会导致整体尺寸变大
                }
            };
            if (this.state.disable) {
                containerProp.className += ' fcui2-textarea-disable'
            }
            else if (!this.state.checkPassed) {
                containerProp.className += ' fcui2-textarea-reject'
            }
            return (
                <div {...containerProp}>
                    <div {...labelProp}>{this.state.label}</div>
                    <textarea {...inputProp}/>
                </div>
            );
        }
    });
});
