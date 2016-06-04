define(function (require) {


    var React = require('react');
    var config = require('./config');


    var ListItem = React.createClass({
        // @override
        getDefaultProps: function () {
            return {
                demo: '',
                label: 'Item',
                onClick: function () {}
            };
        },
        clickHandler: function () {
            this.props.onClick(this.props.label);
        },
        render: function () {
            var prop = {
                className: 'list-item' + (this.props.demo === this.props.label ? ' list-item-selectd' : ''),
                onClick: this.clickHandler
            };
            var type = this.props.label.toLowerCase();
            var label = this.props.label + (config.version[type] ? (' ' + config.version[type]) : '');
            return <div {...prop}>{label}</div>;
        }
    });


    function listFactory(me) {
        var doms = [];
        for (var i = 0; i < config.list.length; i++) {
            if (config.list[i] === '') {
                doms.push(<hr key={i}/>);
                continue;
            }
            doms.push(<ListItem demo={me.props.demo} label={config.list[i]} onClick={me.changeDemo} key={i}/>);
        }
        return doms;
    }


    return React.createClass({
        // @override
        getDefaultProps: function () {
            return {
                demo: 'Tip',
                title: 'FCUI v2.0.2 Demos',
                dispatch: function () {}
            };
        },
        // @override
        getInitialState: function () {
            return {
                message: ''
            };
        },
        changeDemo: function (demo) {
            if (demo === this.props.demo) return;
            this.props.dispatch('changeHash', {demo: demo});
        },
        changeMessage: function (str) {
            this.setState({message: str})
        },
        render: function () {
            var Demo = config.demos[this.props.demo] || config.demos['Tip'];
            return (
                <div>
                    <div className="logo">{this.props.title}</div>
                    <div className="left-container">{listFactory(this)}</div>
                    <div className="right-top-container">{this.state.message}</div>
                    <div className="right-middle-container"><Demo alert={this.changeMessage}/></div>
                </div>
            );
        }
    });
});
