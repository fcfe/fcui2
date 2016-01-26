define(function (require) {

    var TextBox = require('fcui/TextBox.jsx');
    var Button = require('fcui/Button.jsx');
    var checker = require('fcui/core/checker');

    return React.createClass({
        getInitialState: function () {
            return {};
        },
        changeHandler: function () {
            this.props.dispatch();
        },
        textBoxChangeHandler: function (e) {
            if (e.check !== true) {
                console.log(e);
                console.log(this);
            }
        },
        buttonClickHandler: function (e) {
            // 内部状态机
            switch (e.target.props.cmd) {
                case 'disable textbox':
                    var textbox = this.refs.textbox;
                    textbox.setState({disable: !textbox.state.disable});
                    break;
                case 'disable button':
                    var disable = !this.refs.button1.state.disable;
                    this.refs.button1.setState({disable: disable});
                    this.refs.button2.setState({disable: disable});
                    this.refs.button3.setState({disable: disable});
                    break;
                default:
                    // 调用外部状态机
                    this.props.dispatch(e.target.props.cmd);
                    break;
            }
        },
        render: function () {

            var textBoxProp = this.props.textBoxProp;
            textBoxProp.checkout = [checker.maxLength(10, '最多10个字符')];
            textBoxProp.onChange = this.textBoxChangeHandler;

            return (
                <div>
                    <h1>FCUI v2.0.0 Demos</h1>
                    <hr/>
                    Example1:
                    <TextBox {...textBoxProp} ref="textbox"/>
                    <Button {...this.props.button1} onClick={this.buttonClickHandler}/>
                    <Button label="disable/enable" cmd="disable textbox" onClick={this.buttonClickHandler}/>
                    <hr/>
                    Example2:
                    <Button skin="important" label="确定" ref="button1"/>
                    <Button skin="highlight" ref="button2" icon="font-icon-check-square2" label="四个汉字"/>
                    <Button label="普通按钮" ref="button3"/>
                    <Button label="disable/enable" cmd="disable button" onClick={this.buttonClickHandler}/>
                    <hr/>
                </div>
            );
        }
    });
});