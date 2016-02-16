define(function (require) {
    var React = require('react');
    return React.createClass({
        // @override
        getDefaultProps: function () {
            return {
                width: 60,
                value: 0,
                max: Number.POSITIVE_INFINITY,
                min: Number.NEGATIVE_INFINITY,
                step: 1.00,
                type: 'int', // int, float
                fixed: 2,
                checkout: [],
                disable: false,
                showButton: true,
                onChange: function () {}
            };
        },
        // @override
        getInitialState: function () {
            return {
                value: isNaN(this.props.value) ? 0 : this.props.value * 1, // 真实数据
                display: this.fix(isNaN(this.props.value) ? 0 : this.props.value * 1), // 用于显示的数据
                disable: this.props.disable,
                showButton: this.props.showButton,
                checkPassed: true
            };
        },
        // @override
        componentWillReceiveProps: function (props) {
            this.setState({disable: props.disable});
        },
        changeHandler: function (e) {
            if (this.state.disable) return;
            var display = e.target.value;
            var v = this.fix(parseFloat(display));
            if (v === 'NaN') {
                this.setState({
                    display: display,
                    checkPassed: false
                });
            }
            else {
                this.dispatch(display);
            }
        },
        add: function () {
            if (this.state.disable) return;
            var v = this.fix(parseFloat(this.state.value) + parseFloat(this.props.step));
            this.dispatch(v);
        },
        sub: function () {
            if (this.state.disable) return;
            var v = this.fix(parseFloat(this.state.value) - parseFloat(this.props.step));
            this.dispatch(v);
        },
        fix: function (v) {
            v = v > parseFloat(this.props.max) ? parseFloat(this.props.max) : v;
            v = v < parseFloat(this.props.min) ? parseFloat(this.props.min) : v;
            if (this.props.type === 'int') {
                return parseInt(v, 10) + '';
            }
            v = v + '';
            var str = '-.0123456789';
            var result = '';
            for (var i = 0; i < v.length; i++) {
                var char = v.charAt(i);
                if (str.indexOf(char) < 0 || (char === '-' && i > 0)) continue;
                result += char;
            }
            var arr = result.split('.').slice(0, 2);
            var fixed =  parseInt(this.props.fixed, 10);
            if (arr.length > 1 && arr[1].length > fixed) {
                arr[1] = arr[1].slice(0, fixed);
            }
            v = arr.join('.');
            return v.length > 0 ? v : 'NaN';
        },
        check: function (v) {
            for (var i = 0; i < this.props.checkout.length; i++) {
                var result = this.props.checkout[i](v);
                if (result !== true) return result;
            }
            return true;
        },
        dispatch: function (v) {
            var value = parseFloat(this.fix(v));
            var check = this.check(value);
            this.setState({
                value: value,
                display: this.fix(v),
                checkPassed: check === true ? true : false
            });
            this.props.onChange({
                target: this,
                value: value,
                check: check
            });
        },
        focus: function () {
            this.refs.inputbox.focus();
        },
        render: function () {
            var containerProp = {
                className: 'fcui2-numberbox',
                style: {width: this.props.width}
            };
            var inputProp = {
                type: 'text',
                value: this.state.display,
                style: {
                    width: this.props.width - (this.state.showButton ? 40 : 20)
                },
                onChange: this.changeHandler
            };
            var btnContainerProp = {
                className: 'btn-container',
                style: {
                    display: this.state.showButton ? 'block' : 'none'
                }
            };
            if (this.state.disable) {
                containerProp.className += ' fcui2-numberbox-disable'
            }
            else if (!this.state.checkPassed) {
                containerProp.className += ' fcui2-numberbox-reject'
            }
            return (
                <div {...containerProp}>
                    <div {...btnContainerProp}>
                        <div className="font-icon font-icon-largeable-caret-up" onClick={this.add}></div>
                        <div className="font-icon font-icon-largeable-caret-down" onClick={this.sub}></div>
                    </div>
                    <input {...inputProp} disabled={this.state.disable} ref="inputbox"/>
                </div>
            );
        }
    });
});
