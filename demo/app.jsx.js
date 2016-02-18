define(function (require) {


    var React = require('react');


    var TextBox = require('fcui/TextBox.jsx');
    var Button = require('fcui/Button.jsx');
    var Tip = require('fcui/Tip.jsx');
    var DropDownList = require('fcui/DropDownList.jsx');
    var ComboList = require('fcui/ComboList.jsx');
    var Select = require('fcui/Select.jsx');
    var NumberBox = require('fcui/NumberBox.jsx');
    var Pager = require('fcui/Pager.jsx');
    var Dialog = require('fcui/Dialog.jsx');
    var Tree = require('fcui/Tree.jsx');
    var DualTreeSelector = require('fcui/DualTreeSelector.jsx');
    var Table = require('fcui/Table.jsx');


    var checker = require('fcui/core/checker');
    var config = require('./config');
    var dialog = new Dialog();
    var subApp = require('./subApp.jsx');
    var tableField = require('./tableFieldConfig');


    return React.createClass({
        // @override
        getDefaultProps: function () {
            return {
                demoTitle: 'FCUI v2.0.0 Demos'
            };
        },
        // @override
        getInitialState: function () {
            return {outputmsg: ''};
        },
        // @override
        componentDidMount: function () {},
        tableHandler: function (type, param) {
            var msg = type + ';' + JSON.stringify(param);
            this.setState({outputmsg: msg});
        },
        textBoxChangeHandler: function (e) {
            this.setState({outputmsg: e.check === true ? e.value : e.check});
        },
        listClickHandler: function (e) {
            this.props.dispatch(e.value);
        },
        popWindowHandler: function () {
            var me = this;
            dialog.pop({
                title: '注册',
                focus: 'agebox',
                content: subApp,
                contentProps: {
                    label1: '姓名',
                    label2: '年龄'
                },
                onBeforeClose: function (evt) {
                    // 阻止关闭
                    // evt.returnValue = false;
                },
                onClose: function () {
                    me.props.dispatch('close register dialog');
                }
            });
        },
        alertHandler: function () {
            var me = this;
            dialog.alert({
                title: '这样做是错误的！',
                message: '因为是错误的，所以提示icon是红色的',
                iconColor: '#f00',
                onClose: function () {
                    me.props.dispatch('close alert dialog');
                }
            });
        },
        confirmHandler: function () {
            var me = this;
            dialog.confirm({
                title: '是否确定做某件事呢？',
                message: '点"确定"、点"取消"、点"x"会触发不同的回调，看上去虽然麻烦，但写业务时只挂一个onEnter回调就行了。这个提示很长，看上去是不是很难看，所以应该避免这么长的提示。如果字再多点会是什么样子呢？占用占用占用占用占用占用占用占用占用占用占用占占用占用占用占占用占用占用占用，好像也不怎么难看就是下面的按钮有点儿近',
                onEnter: function () {
                    me.props.dispatch('confirm dialog return "enter"');
                },
                onCancel: function () {
                    me.props.dispatch('confirm dialog return "cancel"');
                },
                onClose: function () {
                    me.props.dispatch('confirm dialog return "close"');
                }
            });
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
            var treeNodes = [
                {
                    id: '1',
                    name: 'Node 1',
                    isChildrenLoading: true
                },
                {
                    id: '2',
                    name: 'Node 2',
                    isExpanded: true,
                    children: [
                        {
                            id: '2.1',
                            name: 'Node 2.1'
                        },
                        {
                            id: '2.2',
                            name: 'Node 2.2'
                        }
                    ]
                }
            ];
            var tableProps = {
                message: '这是外部导入的一个信息',
                summary: this.props.tableSummary,
                datasource: this.props.tableData,
                conf: tableField,
                onAction: this.tableHandler
            };

            return (<div>
                <div className="leftContainer">{this.state.outputmsg}</div>
                <div className="topHeader"><h1>{this.props.demoTitle}</h1></div>
                <div className="rightContainer">
                    <h3>Example0: disable all components</h3>
                    <Button label="disable/enable all widgets" cmd="disable all" onClick={this.buttonClickHandler}/>
                    <h3>Example1: Tip</h3>
                    <Tip title="这是标题" content="这是内容这是内容这是。<br>内容这是内容这是内容这是内容这是"/>
                    <Tip icon="font-icon-check-square2" title="如果说这个tip有啥特别" content="可以在layer里面写html"/>
                    <Tip content="没有标题也是可以的"/>
                    <Tip content="layer里的dom的事件本ui不负责挂。<input type='button' value='呵呵'/>"/>
                    <h3>Example2: TextBox</h3>
                    <TextBox ref="textbox" {...this.props.textBoxProp}
                        checkout={[checker.maxLength(10, '最多10个字符')]} onChange={this.textBoxChangeHandler}/>
                    <Button {...this.props.button1} onClick={this.buttonClickHandler}/>
                    <h3>Example3: Button</h3>
                    <Button className="MyClass" ref="button1" skin="important" label="确定"/>
                    <Button ref="button2" skin="highlight" icon="font-icon-check-square2" label="四个汉字"/>
                    <Button ref="button3" label="普通按钮" />
                    <Button ref="button4" skin="important" icon="font-icon-check-square2"
                        label="带ICON的长很长的button"/>
                    <h3>Example4: DropDownList & ComboList</h3>
                    <DropDownList ref="dropdownlist" onClick={this.listClickHandler} label="编辑"
                        datasource={config.listDatasource()}/>
                    <ComboList ref="combolist" cmd="combolist" icon="font-icon-dot" datasource={config.listDatasource()}
                        onClick={this.listClickHandler}/>
                    <Select ref="select" datasource={config.selectData()} label="请选择选项"
                        onChange={this.listClickHandler}/>
                    <h3>Example5: NumberBox</h3>
                    <NumberBox ref="number1" value={1} showButton={false} onChange={this.textBoxChangeHandler}/>
                    <NumberBox ref="number1" value="34" onChange={this.textBoxChangeHandler}/>
                    <NumberBox ref="number2" max="10" min="-10" fixed="2"
                        type="float" onChange={this.textBoxChangeHandler} width="80" step="0.5"/>
                    <h3>Example 5.1: Form</h3>
                    <h3>Example6: Pager</h3>
                    <Pager ref="pager" min="1" max="20" value="10" onChange={this.listClickHandler}/>
                    <h3>Example7: Dialog</h3>
                    <Button label="Pop Dialog" onClick={this.popWindowHandler}/>
                    <Button label="Alert" onClick={this.alertHandler}/>
                    <Button label="Confirm" onClick={this.confirmHandler}/>
                    <h3>Example8: Tree</h3>
                    <Tree treeNodes={treeNodes}
                        onTreeNodeExpandClicked={(node, nodes) => {console.log(this, node, nodes);}}
                        onTreeNodeRemoveClicked={(node, nodes) => {console.log(this, node, nodes);}}
                        onTreeNodeClicked={(node, nodes) => {console.log(this, node, nodes);}}
                    />
                    <h3>Example9: Dual Tree Selector</h3>
                    <DualTreeSelector leftTreeNodes={treeNodes} rightTreeNodes={[]} />
                    <h3>Example10: Complex Table</h3>
                    <Table {...tableProps}/>
                </div>
            </div>);
        }
    });
});
