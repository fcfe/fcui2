define(function (require) {

    var TextBox = require('fcui2/TextBox.jsx');
    var React = require('react');
    var WarningLayer = require('fcui2/WarningLayer.jsx');

    return React.createClass({
        // @override
        getDefaultProps: function () {
            return {};
        },
        // @override
        getInitialState: function () {
            return {
                anchor: null
            };
        },
        // @override
        componentDidMount: function () {
            this.setState({
                anchor: this.refs.anchor
            });
        },
        render: function () {
            return (
                <div>
                    <div ref="anchor" style="margin-top:100px;width:1000px;height:500px;border:1px solid;line-height:300px;margin:auto;text-align:center;">
                        <h1>Anchor</h1>
                    </div>
                    <WarningLayer
                        message="location 12.5<br/>这里是内容<br/>非常长的一个内容，<br/>甚至需要换行的内容"
                        location="12.5"
                        skin="white"
                        anchor={this.state.anchor}
                    />
                    <WarningLayer
                        message="location 1<br/>这里是内容<br/>非常长的一个内容，<br/>甚至需要换行的内容"
                        location="1"
                        anchor={this.state.anchor}
                    />
                    <WarningLayer
                        message="location 2<br/>这里是内容<br/>非常长的一个内容，<br/>甚至需要换行的内容"
                        location="2"
                        anchor={this.state.anchor}
                    />
                    <WarningLayer
                        message="location 3.5<br/>这里是内容<br/>非常长的一个内容，<br/>甚至需要换行的内容"
                        location="3.5"
                        skin="white"
                        anchor={this.state.anchor}
                    />
                    <WarningLayer
                        message="location 4。这是单行内容"
                        location="4"
                        anchor={this.state.anchor}
                    />
                    <WarningLayer
                        message="location 5<br/>这里是内容<br/>非常长的一个内容，<br/>甚至需要换行的内容"
                        location="5"
                        anchor={this.state.anchor}
                    />
                    <WarningLayer
                        message="location 6.5<br/>这里是内容<br/>非常长的一个内容，<br/>甚至需要换行的内容"
                        location="6.5"
                        skin="white"
                        anchor={this.state.anchor}
                    />
                    <WarningLayer
                        message="location 6。这是单行内容"
                        location="6"
                        anchor={this.state.anchor}
                    />
                    <WarningLayer
                        message="location 8<br/>这里是内容<br/>非常长的一个内容，<br/>甚至需要换行的内容"
                        location="8"
                        anchor={this.state.anchor}
                    />
                    <WarningLayer
                        message="location 9.5<br/>这里是内容<br/>非常长的一个内容，<br/>甚至需要换行的内容"
                        location="9.5"
                        skin="white"
                        anchor={this.state.anchor}
                    />
                    <WarningLayer
                        message="location 9。这是单行内容"
                        location="9"
                        anchor={this.state.anchor}
                    />
                </div>
            );
        }
    });
});
