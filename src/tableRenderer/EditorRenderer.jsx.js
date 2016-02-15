define(function (require) {

    var util = require('../core/util');
    var TextBox = require('../TextBox.jsx');
    var Button = require('../Button.jsx');
    var config = require('../core/language');

    return React.createClass({
        getDefaultProps: function () {
            return {
                conf: {},
                item: {},
                index: -1,
                onAction: function () {}
            };
        },
        getInitialState: function () {
            return {
                errorMsg: ''
            };
        },
        clickHandler: function () {
            this.props.onAction('EditorRendererClick', {
                field: this.props.conf.field,
                item: this.props.item,
                index: this.props.index
            });
        },
        submit: function () {
            if (this.refs.input.state.checkPassed !== true) return;
            this.props.onAction('EditorRendererSubmit', {
                value: this.refs.input.state.value,
                field: this.props.conf.field,
                item: this.props.item,
                index: this.props.index
            });
        },
        inputChangeHandler: function (e) {
            this.setState({errorMsg: e.check === true ? '' : e.check});
        },
        openEditor: function () {
            var editor = this.refs.editor.getDOMNode();
            var root = this.refs.rootContainer.getDOMNode();
            var pos = util.getDOMPosition(root);
            root.style.zIndex = 999;
            editor.style.display = 'block';
            editor.className = pos.x + editor.offsetWidth > document.body.offsetWidth
                ? 'editor editor-left' : 'editor editor-right';
        },
        closeEditor: function () {
            var editor = this.refs.editor.getDOMNode();
            var root = this.refs.rootContainer.getDOMNode();
            root.style.zIndex = 0;
            editor.style.display = 'none';
            editor.className = 'editor';
        },
        render: function () {
            var item = this.props.item;
            var conf = this.props.conf;
            var value = item[conf.field];
            var tdProp = {
                className: 'td-editor',
                ref: 'rootContainer',
                style: {},
                onMouseLeave: this.closeEditor
            };
            if (typeof conf.content === 'function') {
                value = conf.content(value, item);
            }
            tdProp.style.width = typeof conf.width === 'number' ? conf.width : undefined;
            return (
                <td {...tdProp}>
                    <div className="font-icon font-icon-edit" onClick={this.openEditor}></div>
                    <div className="link" onClick={this.clickHandler}>{value}</div>
                    <div className="editor" ref="editor">
                        <TextBox ref="input" {...conf.editorProp} value={value} onChange={this.inputChangeHandler}/>
                        <span className="alert">{this.state.errorMsg}</span>
                        <Button onClick={this.submit} skin="important" disable={this.state.errorMsg.length > 0} label={config.button.enter}/>
                        <Button onClick={this.closeEditor} label={config.button.cancel}/>
                    </div>
                </td>
            );
        }
    });
});
