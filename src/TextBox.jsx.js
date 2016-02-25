define(function (require) {

    var React = require('react');

    return React.createClass({
        // @override
        getDefaultProps: function () {
            return {
                className: '',
                width: 200,
                label: '',  // 输入框下方的输入提示
                value: '',  // 初始value
                disable: false,
                onChange: function () {}
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
                className: 'fcui2-textbox ' + this.props.className,
                style: {width: this.props.width}
            };
            var labelProp = {
                style: {
                    visibility: this.state.value.length ? 'hidden' : 'visible'
                }
            };
            var inputProp = {
                type: 'text',
                value: this.state.value,
                style: {width: this.props.width - 20},
                onChange: this.changeHandler
            };
            if (this.state.disable) {
                containerProp.className += ' fcui2-textbox-disable'
            }
            else if (!this.state.checkPassed) {
                containerProp.className += ' fcui2-textbox-reject'
            }
            return (
                <div {...containerProp}>
                    <div {...labelProp}>{this.state.label}</div>
                    <input {...inputProp} disabled={this.state.disable} ref="inputbox"/>
                </div>
            );
        }
    });
});
