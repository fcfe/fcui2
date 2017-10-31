
define(function (require) {

    var React = require('react');

    return {
        produceItems: function produceItems(me) {
            if (!(me.props.datasource instanceof Array) || !me.props.datasource.length) return '';
            var doms = [];
            var value = me.___getValue___();
            value = isNaN(value) ? 0 : value * 1;
            for (var i = 0; i < me.props.datasource.length; i++) {
                var props = {
                    key: i,
                    className: 'fcui2-wizard-item',
                    onClick: me.onClick,
                    'data-ui-cmd': i,
                    style: {
                        width: parseFloat(100 / me.props.datasource.length).toFixed(2) + '%',
                        zIndex: me.props.datasource.length - i
                    }
                };
                if (me.props.disabled) {
                    props.className += ' fcui2-wizard-item-disabled';
                } else if (i < value + 1) {
                    props.className += ' fcui2-wizard-item-active' + (i === value - 1 ? ' fcui2-wizard-item-pre' : '');
                } else {
                    props.className += ' fcui2-wizard-item-normal';
                }
                if (value === i) {
                    props.className += ' fcui2-wizard-item-current';
                }
                doms.push(React.createElement(
                    'div',
                    props,
                    React.createElement(
                        'span',
                        { 'data-ui-cmd': i },
                        me.props.datasource[i]
                    ),
                    React.createElement('div', { 'data-ui-cmd': i, className: 'fcui2-wizard-arrow-bg' }),
                    React.createElement(
                        'div',
                        { 'data-ui-cmd': i, className: 'fcui2-wizard-arrow' },
                        React.createElement(
                            'span',
                            { 'data-ui-cmd': i },
                            i + 1
                        )
                    )
                ));
            }
            return doms;
        }
    };
});