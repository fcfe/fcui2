define(function (require) {

    var Creater = require('../Main.jsx');
    var TextBox = require('fcui/TextBox.jsx');
    var React = require('react');
    var Information = require('../Information.jsx');
    var WarningLayer = require('fcui/WarningLayer.jsx');

    var items = [
        {
            title: 'Normal TextBox',
            props: {}
        },
        {
            title: 'TextBox with ClassName',
            props: {className: 'marginLeft100 border2'}
        },
        {
            title: 'Readonly TextBox',
            props: {value: 'readonly'}
        },
        {
            title: 'Disabled TextBox',
            props: {disabled: true}
        },
        {
            title: 'Disabled TextBox with value',
            props: {disabled: true, value: 'value'}
        },
        {
            title: 'TextBox with Placeholder',
            props: {placeholder: 'please input'}
        },
        {
            title: 'TextBox with Placeholder and value',
            props: {value: 1, placeholder: 'please input'}
        },
        {
            title: 'TextBox with Width',
            props: {width: 500}
        }
    ];

    var Example1 = Creater(TextBox, items, 'onChange');

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
                warningAnchor: this.refs.tb1.refs.container
            });
        },
        render: function () {
            return (
                <div>
                    <Example1 alert={this.props.alert}/>
                    <div className="demo-item">
                        <Information title="TextBox with warning layer"/>
                        <TextBox ref="tb1"/>
                        <WarningLayer message="hahaa" location="bottom" anchor={this.state.warningAnchor}/>
                    </div>
                </div>
            );
        }
    });
});
