define(function (require) {

    var TextBox = require('fcui/TextBox.jsx');
    var Button = require('fcui/Button.jsx');
    var Tip = require('fcui/Tip.jsx');

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
            return (
                <div>
                    <h1>FCUI v2.0.0 Demos</h1>
                    <hr/>
                    Example1:
                    <TextBox {...this.props.textBoxProp} ref="textbox" checkout={[checker.maxLength(10, '最多10个字符')]} onChange={this.textBoxChangeHandler}/>
                    <Button {...this.props.button1} onClick={this.buttonClickHandler}/>
                    <Button label="disable/enable" cmd="disable textbox" onClick={this.buttonClickHandler}/>
                    <hr/>
                    Example2:
                    <Button skin="important" label="确定" ref="button1"/>
                    <Button skin="highlight" ref="button2" icon="font-icon-check-square2" label="四个汉字"/>
                    <Button label="普通按钮" ref="button3"/>
                    <Button skin="important" icon="font-icon-check-square2" label="disable/enable" cmd="disable button" onClick={this.buttonClickHandler}/>
                    <hr/>
                    Example3:
                    <Tip title="这是标题" content="这是内容这是内容这是。<br>内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是这是内容这是内容。内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容"/>
                    <Tip icon="font-icon-check-square2" title="如果说这个tip有啥特别" content="那就是一切显示的内容都可以替换，并且可以在layer里面写html"/>
                    <Tip content="没有标题也是可以的"/>
                    <Tip content="自己在layer里面加dom也是可以的，但是layer里的dom的事件本ui不负责挂。<input type='button' value='呵呵'/>"/>
                </div>
            );
        }
    });
});