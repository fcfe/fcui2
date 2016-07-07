
define(function (require) {

    var React = require('react');

    return {
        linkFactory: function (me) {
            var doms = [];
            for (var i = 0; i < me.props.datasource.length; i++) {
                var item = me.props.datasource[i];
                if (!item.hasOwnProperty('href') || me.props.disabled || item.disabled) {
                    doms.push(<span key={'n' + i} className="fcui2-crumb-label">{item.label}</span>);
                }
                else {
                    doms.push(<a key={'l' + i} href={item.href} target={item.target}>{item.label}</a>);
                }
                if (i < me.props.datasource.length - 1) {
                    doms.push(<div key={'s' + i} className="fcui2-crumb-separator">{me.props.separator}</div>);
                }
            }
            return doms;
        }
    };

});
