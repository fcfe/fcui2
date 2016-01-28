define(function (require) {
    return React.createClass({
        // @override
        getDefaultProps: function () {
            return {
                width: 200,
                label: '',
                value: '',
                disable: false,
                checkout: [],
                onChange: function () {}
            };
        },
        // @override
        getInitialState: function () {
            return {
                value: this.props.value,
                label: this.props.label,
                disable: this.props.disable,
                checkPassed: true
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
                check: true
            };
            for (var i = 0; i < this.props.checkout.length; i++) {
                var result = this.props.checkout[i](e.target.value);
                if (result !== true) {
                    evt.check = result;
                    break;
                }
            }
            this.setState({
                value: e.target.value,
                checkPassed: evt.check === true ? true : false
            });
            this.props.onChange(evt);
        },
        render: function () {
            var containerProp = {
                className: 'ui-textbox',
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
                containerProp.className += ' ui-textbox-disable'
            }
            else if (!this.state.checkPassed) {
                containerProp.className += ' ui-textbox-reject'
            }
            return (
                <div {...containerProp}>
                    <div {...labelProp}>{this.state.label}</div>
                    <input {...inputProp} disabled={this.state.disable}/>
                </div>
            );
        }
    });
});
