define(function (require) {

    var TextBox = require('fcui/TextBox.jsx');
    var React = require('react');
    var WarningLayer = require('fcui/WarningLayer.jsx');

    return React.createClass({
        // @override
        getDefaultProps: function () {
            return {};
        },
        // @override
        getInitialState: function () {
            return {
                warningAnchor: null
            };
        },
        // @override
        componentDidMount: function () {
            this.setState({
                warningAnchor1: this.refs.tb1.refs.container,
                warningAnchor2: this.refs.tb2.refs.container,
                warningAnchor3: this.refs.tb3.refs.container,
                warningAnchor4: this.refs.tb4.refs.container
            });
        },
        render: function () {
            return (
                <div>
                    <h4>./doc/src/demos/components/WarningLayer.jsx.js</h4>
                    <div className="demo-item">
                        <h4>WarningLayer with location '6'</h4>
                        <TextBox ref="tb1"/>
                        <WarningLayer message="这是一个错误信息" location="6" anchor={this.state.warningAnchor1}/>
                    </div>
                    <br/><br/>
                    <div className="demo-item">
                        <h4>WarningLayer with location '1'</h4>
                        <br/><br/>
                        <TextBox ref="tb2"/>
                        <WarningLayer message="这是一个错误信息" location="1" anchor={this.state.warningAnchor2}/>
                    </div>
                    <div className="demo-item">
                        <h4>WarningLayer with location '9'</h4>
                        <TextBox ref="tb3" style={{marginLeft: 300}}/>
                        <WarningLayer message="这是一个错误信息" location="9" anchor={this.state.warningAnchor3}/>
                    </div>
                    <div className="demo-item">
                        <h4>WarningLayer with location '4'</h4>
                        <TextBox ref="tb4" style={{marginLeft: 300}}/>
                        <WarningLayer message="这是一个错误信息" location="4" anchor={this.state.warningAnchor4}/>
                    </div>
                </div>
            );
        }
    });
});
