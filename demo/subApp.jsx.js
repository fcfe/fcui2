define(function (require) {

    var TextBox = require('fcui/TextBox.jsx');
    var Button = require('fcui/Button.jsx');
    var NumberBox = require('fcui/NumberBox.jsx');
    var React = require('react');

    return React.createClass({
        getInitialState: function () {
            return {
                width: 400,
                height: 600
            };
        },
        componentDidMount: function () {
            var me = this;
            setInterval(function () {
                var width = ~~(400 + 200 * Math.random());
                var height = ~~(400 + 600 * Math.random());
                me.setState({width: width, height: height});
            }, 1000);
        },
        componentDidUpdate: function () {
            this.props.resize();
        },
        render: function () {
            var tmpStyle = {
                marginTop: 10,
                width: this.state.width,
                height: this.state.height,
                border: '1px solid #f00'
            };
            return (
                <div className="subAppContainer">
                    <span>{this.props.label1}：</span><TextBox label="最多4个汉字" ref="namebox"/><br/><br/>
                    <span>{this.props.label2}：</span><NumberBox ref="agebox"/><br/><br/><br/><br/>
                    <Button skin="important" label="确定" onClick={this.props.dispose}/>
                    <Button label="取消" onClick={this.props.close}/>
                    <div style={tmpStyle}>
                        width: {this.state.width}<br/>
                        height: {this.state.height}
                    </div>
                </div>
            );
        }
    });
});
