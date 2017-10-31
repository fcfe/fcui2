
define(function (require) {

    var React = require('react');
    var NormalRenderer = require('../components/tree/NormalRenderer.jsx');

    return {

        leafFactory: function leafFactory(me) {
            if (!(me.props.datasource instanceof Array) || !me.props.datasource.length) return null;
            var value = me.___getValue___();
            try {
                value = JSON.parse(value);
            } catch (e) {
                value = {};
            }
            var expand = value.expand || {};
            var result = [];
            addLeaves(me.props.datasource, '');
            return result;
            function addLeaves(arr, level) {
                for (var i = 0; i < arr.length; i++) {
                    var item = JSON.parse(JSON.stringify(arr[i]));
                    var key = level.length ? level + ',' + i : i + '';
                    var props = {
                        key: key, // 层次
                        index: key, // react会吃掉key这个属性，呵呵
                        item: item, // 数据源
                        value: value, // tree的值
                        treeComponent: me, // tree实例
                        disabled: me.props.disabled || item.disabled, // 禁用
                        onAction: me.props.onAction
                    };
                    if (item.hr) {
                        result.push(React.createElement('hr', props));
                        continue;
                    }
                    var Renderer = typeof me.props.leafRenderer === 'function' ? me.props.leafRenderer : NormalRenderer;
                    result.push(React.createElement(Renderer, props));
                    if (item.children instanceof Array && expand[item.value]) {
                        addLeaves(item.children, props.index);
                    }
                }
            }
        }
    };
});