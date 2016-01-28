define(function (require) {

    var checker = require('fcui/core/checker');
    var config = require('./config');

    var TextBox = require('fcui/TextBox.jsx');
    var Button = require('fcui/Button.jsx');
    var Tip = require('fcui/Tip.jsx');
    var DropDownList = require('fcui/DropDownList.jsx');
    var ComboList = require('fcui/ComboList.jsx');
    var Select = require('fcui/Select.jsx');

    return React.createClass({
        getInitialState: function () {
            return {outputmsg: ''};
        },
        changeHandler: function () {
            this.props.dispatch();
        },
        textBoxChangeHandler: function (e) {
            this.setState({outputmsg: e.check});
        },
        listClickHandler: function (e) {
            this.props.dispatch(e.value);
        },
        buttonClickHandler: function (e) {
            // 内部状态机
            switch (e.value) {
                case 'disable all':
                    for (var key in this.refs) this.refs[key].setState({disable: !this.refs[key].state.disable});
                    break;
                default:
                    // 调用外部状态机
                    this.props.dispatch(e.target.props.cmd);
                    break;
            }
        },
        render: function () {
            return (<div>
                <div className="leftContainer">{this.state.outputmsg}</div>
                <div className="topHeader"><h1>FCUI v2.0.0 Demos</h1></div>
                <div className="rightContainer">
                    <h3>Example0</h3>
                    <Button label="disable/enable all widgets" cmd="disable all" onClick={this.buttonClickHandler}/>
                    <h3>Example1</h3>
                    <Tip title="这是标题" content="这是内容这是内容这是。<br>内容这是内容这是内容这是内容这是"/>
                    <Tip icon="font-icon-check-square2" title="如果说这个tip有啥特别" content="可以在layer里面写html"/>
                    <Tip content="没有标题也是可以的"/>
                    <Tip content="layer里的dom的事件本ui不负责挂。<input type='button' value='呵呵'/>"/>
                    <h3>Example2</h3>
                    <TextBox ref="textbox" {...this.props.textBoxProp}
                        checkout={[checker.maxLength(10, '最多10个字符')]} onChange={this.textBoxChangeHandler}/>
                    <Button {...this.props.button1} onClick={this.buttonClickHandler}/>
                    <h3>Example3</h3>
                    <Button ref="button1" skin="important" label="确定"/>
                    <Button ref="button2" skin="highlight" icon="font-icon-check-square2" label="四个汉字"/>
                    <Button ref="button3" label="普通按钮" />
                    <Button ref="button4" skin="important" icon="font-icon-check-square2"
                        label="带ICON的长很长的button"/>
                    <h3>Example4</h3>
                    <DropDownList ref="dropdownlist" onClick={this.listClickHandler} label="编辑"
                        datasource={config.listDatasource()}/>
                    <ComboList ref="combolist" cmd="combolist" icon="font-icon-dot" datasource={config.listDatasource()}
                        onClick={this.listClickHandler}/>
                    <Select ref="select" datasource={config.selectData()} label="请选择选项"
                        onChange={this.listClickHandler}/>
                    <h3>Example5</h3>
                </div>
            </div>);
        }
    });
});
