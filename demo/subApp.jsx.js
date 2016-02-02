define(function (require) {

    var TextBox = require('fcui/TextBox.jsx');
    var Button = require('fcui/Button.jsx');
    var NumberBox = require('fcui/NumberBox.jsx');

    return React.createClass({
        getInitialState: function () {
            return {};
        },
        render: function () {
            return (
                <div>
                    <span>{this.props.label1}：</span><TextBox label="最多4个汉字" ref="namebox"/><br/><br/>
                    <span>{this.props.label2}：</span><NumberBox ref="agebox"/><br/><br/><br/><br/>
                    <Button skin="important" label="确定" onClick={this.props.close}/>
                    <Button label="取消" onClick={this.props.close}/>
                </div>
            );
        }
    });
});
