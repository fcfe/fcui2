/**
 * 树
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2
 */
define(function (require) {


    var React = require('react');
    var cTools = require('./core/componentTools');
    var NormalRenderer = require('./components/tree/NormalRenderer.jsx');
    var InputWidget = require('./mixins/InputWidget');


    return React.createClass({
        // @override
        mixins: [InputWidget],
        // @override
        getDefaultProps: function () {
            return {
                skin: '',
                className: '',
                style: {},
                disabled: false,
                datasource: [],
                onAction: cTools.noop,
                leafRenderer: NormalRenderer,
                valueTemplate: JSON.stringify({
                    expand: {}
                })
            };
        },
        // @override
        getInitialState: function () {
            return {};
        },
        render: function () {
            return (
                <div {...cTools.containerBaseProps('tree-test', this)}>
                    {leafFactory(this)}
                </div>
            );
        }
    });


    function leafFactory(me) {
        if (!(me.props.datasource instanceof Array) || !me.props.datasource.length) return null;
        var value = me.___getValue___();
        try {
            value = JSON.parse(value);
        }
        catch (e) {
            value = {};
        }
        var expand = value.expand || {};
        var result = [];
        addLeaves(me.props.datasource, '');
        return result;
        function addLeaves(arr, level) {
            for (var i = 0; i < arr.length; i++) {
                var item = JSON.parse(JSON.stringify(arr[i]));
                var key = level.length ? (level + ',' + i) : (i + '');
                var props = {
                    key: key,                   // 层次
                    index: key,                 // react会吃掉key这个属性，呵呵
                    item: item,                 // 数据源
                    value: value,               // tree的值
                    treeComponent: me,          // tree实例
                    disabled: me.props.disabled || item.disabled, // 禁用
                    onAction: me.props.onAction
                };
                if (item.hr) {
                    result.push(<hr {...props}/>);
                    continue;
                }
                var Renderer = typeof me.props.leafRenderer === 'function' ? me.props.leafRenderer : NormalRenderer;
                result.push(<Renderer {...props}/>);
                if (item.children instanceof Array && expand[item.value]) {
                    addLeaves(item.children, props.index);
                }
            }
        }
    }


});
