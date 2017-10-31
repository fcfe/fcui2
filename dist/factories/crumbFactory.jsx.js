
define(function (require) {

    var React = require('react');

    return {
        linkFactory: function linkFactory(me) {
            var doms = [];
            for (var i = 0; i < me.props.datasource.length; i++) {
                var item = me.props.datasource[i];
                if (!item.hasOwnProperty('href') || me.props.disabled || item.disabled) {
                    doms.push(React.createElement(
                        'span',
                        { key: 'n' + i, className: 'fcui2-crumb-label' },
                        item.label
                    ));
                } else {
                    doms.push(React.createElement(
                        'a',
                        { key: 'l' + i, href: item.href, target: item.target },
                        item.label
                    ));
                }
                if (i < me.props.datasource.length - 1) {
                    doms.push(React.createElement('div', { key: 's' + i, className: 'fcui2-crumb-separator' }));
                }
            }
            return doms;
        }
    };
});