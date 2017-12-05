
define(function (require) {

    var React = require('react');
    var cTools = require('../core/componentTools');
    var NormalRenderer = require('../components/list/NormalRenderer.jsx');

    return {
        listFactory: function listFactory(me) {
            if (!(me.props.datasource instanceof Array) || !me.props.datasource.length) return null;
            var result = [];
            for (var i = 0; i < me.props.datasource.length; i++) {
                var item = me.props.datasource[i];
                if (item.hr) {
                    result.push(React.createElement('hr', { ref: 'list-item-' + i, key: i }));
                    continue;
                }
                var prop = JSON.parse(JSON.stringify(item)); //深度克隆
                var Renderer = item.renderer;
                prop.key = prop.hasOwnProperty('key') ? prop.key : i;
                prop.onClick = typeof me.props.onClick === 'function' ? me.props.onClick : cTools.noop;
                prop.onMouseOver = typeof me.props.onMouseOver === 'function' ? me.props.onMouseOver : cTools.noop;
                prop.disabled = prop.disabled || me.props.disabled;
                prop.parentComponent = me;
                prop.ref = 'list-item-' + i;

                Renderer = typeof Renderer === 'function' ? Renderer : me.props.itemRenderer;
                Renderer = typeof Renderer === 'function' ? Renderer : NormalRenderer;

                result.push(React.createElement(Renderer, prop));
            }
            return result;
        }
    };
});