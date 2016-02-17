define(function (require) {

    var TextBox = require('fcui/TextBox.jsx');
    var Button = require('fcui/Button.jsx');
    var NumberBox = require('fcui/NumberBox.jsx');
    var React = require('react');

    return React.createClass({
        getInitialState: function () {
            return {};
        },
        render: function () {
            var tmpStyle = {
                marginTop: 10,
                backgroundColor: '#000',
                width: 1000,
                height: 1000
            };
            return (
                <div>
                    <span>{this.props.label1}：</span><TextBox label="最多4个汉字" ref="namebox"/><br/><br/>
                    <span>{this.props.label2}：</span><NumberBox ref="agebox"/><br/><br/><br/><br/>
                    <Button skin="important" label="确定" onClick={this.props.dispose}/>
                    <Button label="取消" onClick={this.props.close}/>
                    <div style={tmpStyle}></div>
                </div>
            );
        }
    });
});
