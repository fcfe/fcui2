define(function (require) {


    var React = require('react');
    var Parse = require('./Parse.jsx');
    var config = require('./config');


    function menuFactory(me) {
        var doms = [];
        for (var i = 0; i < config.menu.length; i++) {
            var prop = {
                key: i + '',
                'data-level': config.menu[i].level,
                className: 'font-icon menu-item font-icon-largeable-caret-'
                    + (me.props.level !== config.menu[i].level ? 'right' : 'down'),
                onClick: me.onLevelChange
            };
            doms.push(<div {...prop}>{config.menu[i].label}</div>);
            if (me.props.level !== config.menu[i].level) continue;
            for (var j = 0; j < config.menu[i].children.length; j++) {
                var item = config.menu[i].children[j];
                var itemProp = {
                    key: i + '-' + j,
                    'data-file': item.id,
                    className: 'list-item' + (me.props.file === item.id ? ' list-item-selectd' : ''),
                    onClick: me.onFileChange
                };
                doms.push(<div {...itemProp}>{item.label}</div>);
            }
        }
        return doms;
    }


    return React.createClass({
        // @override
        getDefaultProps: function () {
            return {
                file: 'src\\Button.jsx.js',
                level: 'widget',
                title: 'FCUI2 Docs',
                dispatch: function () {}
            };
        },
        onLevelChange: function (e) {
            var level = e.target.dataset.level;
            level = level === this.props.level ? '' : level;
            this.props.dispatch('changeHash', {level: level});
        },
        onFileChange: function (e) {
            var file = e.target.dataset.file;
            if (file === this.props.file) return;
            this.props.dispatch('changeHash', {file: file});
        },
        render: function () {
            return (
                <div>
                    <div className="logo">{this.props.title}</div>
                    <div className="left-container">{menuFactory(this)}</div>
                    <div className="right-top-container"></div>
                    <div className="right-middle-container">
                        <Parse file={this.props.file}/>
                    </div>
                </div>
            );
        }
    });
});
