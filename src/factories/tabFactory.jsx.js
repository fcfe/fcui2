
define(function (require) {

    var React = require('react');
    var NormalRenderer = require('../components/tab/NormalRenderer.jsx');
    var cTools = require('../core/componentTools');

    return {
        produceTabs: function (me) {
            if (!(me.props.datasource instanceof Array) || !me.props.datasource.length) return null;
            var doms = [];
            var value = me.___getValue___();
            for (var i = 0; i < me.props.datasource.length; i++) {
                var Renderer = typeof me.props.renderer === 'function' ? me.props.renderer : NormalRenderer;
                var props = me.props.datasource[i];
                props.key = i;
                props.onClick = props.disabled ? cTools.noop : me.onClick;
                if (me.props.disabled || props.disabled) {
                    props.className = 'fcui2-tab-item-disabled';
                }
                else {
                    props.className = 'fcui2-tab-item' + (props.value === value ? '-active' : '');
                }
                doms.push(<Renderer {...props} />);
            }
            return doms;
        }
   };

});
