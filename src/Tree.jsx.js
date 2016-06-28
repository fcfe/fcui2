/**
 * 树
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2.1
 */
define(function (require) {


    var React = require('react');
    var cTools = require('./core/componentTools');
    var NormalRenderer = require('./components/tree/NormalRenderer.jsx');
    var InputWidget = require('./mixins/InputWidget');


    return React.createClass({
        /**
         * @properties
         * @param {Import|Properties} src\core\componentTools.js skin className style disabled
         * @param {Array.<TreeItemObject>} datasource 树数据源
         * @param {Function} onAction 树回调总线
         * @param {ReactClass} leafRenderer 树叶子渲染器
         * @param {Import|Properties} src\mixins\InputWidget.js
         *      value onChange name validations customErrorTemplates valueLink valueTemplate
         */
        /**
         * @fire Import src\mixins\InputWidget.js XXX onChange
         */
        /**
         * @fire Tree onAction
         * @param {String} type 回调类型：
         * @param {Object} param 回调参数
         */
        /**
         * @fire Import src\mixins\TreeNodeBase.js Tree onAction
         */
        /**
         * @structure TreeItemObject
         * @example
         *  {
         *      label: <required>,
         *      value: <required>,
         *      children: <optional>
         *  }
         * @param {String} label 叶子显示的文字
         * @param {String} value 叶子对应的值，随事件对象通过返回
         * @param {Array.<TreeItemObject>} children 子树数据源
         */
        /**
         * @structure TreeValueTemplate
         * @example
         *  {
         *      expand: <optional>
         *  }
         * @attention tree的value类型是字符串，用JSON.stringify方法将示例中的数据结构转换，因此操作value时不能出环
         * @param {Object} expand 树的展开状态，以TreeItemObject.value为key，存在的key表示该子树的根层级为展开状态
         */
        // @override
        mixins: [InputWidget],
        // @override
        getDefaultProps: function () {
            return {
                // base
                skin: '',
                className: '',
                style: {},
                disabled: false,
                // self
                datasource: [],
                onAction: cTools.noop,
                leafRenderer: NormalRenderer,
                // mixins
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
            this.___loadingCache___ = {};
            return (
                <div {...cTools.containerBaseProps('tree', this)}>
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
