define(function (require) {


    var React = require('react');
    var Parser = require('./parsers/Main.jsx');
    var config = require('./config');
    var util = require('fcui2/core/util');

    function menuFactory(me) {
        var doms = [];
        for (var i = 0; i < config.menu.length; i++) {
            var prop = {
                key: i + '',
                className: 'menu-item',
                'data-level': config.menu[i].level,
                onClick: me.onLevelChange
            };
            doms.push(
                <div {...prop}>
                    <span data-level={config.menu[i].level}
                        className={
                            'font-icon  font-icon-largeable-caret-'
                                + (me.props.level !== config.menu[i].level ? 'right' : 'down')
                        }>
                    </span>
                    <span data-level={config.menu[i].level}>{config.menu[i].label}</span>
                </div>
            );
            if (me.props.level !== config.menu[i].level) {
                doms.push(<hr key={i + '-begin'}/>);
                continue;
            }
            doms.push(<hr key={i + '-begin'}/>);
            for (var j = 0; j < config.menu[i].children.length; j++) {
                var item = config.menu[i].children[j];
                if (item === '') {
                    doms.push(<hr key={i + '-' + j}/>);
                    continue;
                }
                var itemProp = {
                    key: i + '-' + j,
                    'data-file': item.id.replace(/\\/g, '_'),
                    className: 'list-item' + (me.props.file === item.id.replace(/\\/g, '_') ? ' list-item-selectd' : ''),
                    onClick: me.onFileChange
                };
                doms.push(<div {...itemProp}>{item.label}</div>);
            }
            doms.push(<hr key={i + '-end'}/>);
        }
        return doms;
    }


    return React.createClass({
        // @override
        childContextTypes: {
            appSkin: React.PropTypes.string
        },
        // @override
        getChildContext: function () {
            return {
                appSkin: typeof this.props.skin === 'string' ? this.props.skin : ''
            };
        },
        // @override
        getDefaultProps: function () {
            return {
                file: 'src\\Button.jsx.js',
                level: 'widget',
                title: 'FCUI2 Docs OneUX3',
                skin: 'oneux3',
                dispatch: function () {}
            };
        },
        // @override
        getInitialState: function () {
            return {
                message: ''
            };
        },
        // @override
        componentDidMount: function () {
            this.messageTimer = null;
        },
        onLevelChange: function (e) {
            var level = util.getDataset(e.target).level;
            level = level === this.props.level ? '' : level;
            this.props.dispatch('changeHash', {level: level});
        },
        onFileChange: function (e) {
            var file = util.getDataset(e.target).file;
            if (file === this.props.file) return;
            this.props.dispatch('changeHash', {file: file});
        },
        onMessage: function (str) {
            clearTimeout(this.messageTimer);
            this.setState({message: str});
            var me = this;
            this.messageTimer = setTimeout(function () {
                me.setState({message: ''});
            }, 2000);
        },
        render: function () {
            var Demo = config.demos[this.props.file.replace(/_/g, '\\')];
            return (
                <div>
                    <div className="logo">{this.props.title}</div>
                    <div className="left-container">{menuFactory(this)}</div>
                    <div className="right-top-container">{this.state.message}</div>
                    <div className="right-middle-container">
                        <Parser file={this.props.file}/>
                        {
                            Demo ? 
                                <div className="demo-container">
                                    <h3>Demos</h3>
                                    <Demo alert={this.onMessage}/>
                                </div> 
                            : null
                        }
                    </div>
                </div>
            );
        }
    });
});
