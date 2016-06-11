/**
 * 双树选择器
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2
 */
define(function (require) {


    var React = require('react');
    var cTools = require('./core/componentTools');
    var Tree = require('./Tree-test.jsx');
    var Renderer = require('./components/tree/SelectRenderer.jsx');
    var InputWidget = require('./mixins/InputWidget');
    var tools = require('./core/treeTools');


    return React.createClass({
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
                leafRenderer: Renderer,
                selectorEngine: tools.dualTreeSelectorEngine,
                // mixin
                valueTemplate: JSON.stringify({selected: {}})
            };
        },
        // @override
        getInitialState: function () {
            return {
                expand: {}
            }
        },
        // @override
        componentDidUpdate: function () {
            // 检查selected中标记为1的item的children是否加载完毕了。
            var selected = JSON.parse(this.___getValue___()).selected || {};
            var me = this;
            targetAsyncLeaf(this.props.datasource);
            function targetAsyncLeaf(arr) {
                if (!(arr instanceof Array) || !arr.length) return;
                for (var i = 0; i < arr.length; i++) {
                    var item = arr[i];
                    // 叶子节点
                    if (!(item.children instanceof Array)) continue;
                    // 无孩子节点
                    if (!item.children.length) continue;
                    // 有孩子节点，但不是新加载的
                    if (selected[item.value] !== 1) {
                        targetAsyncLeaf(item.children);
                        continue;
                    }
                    delete selected[item.value];
                    me.props.selectorEngine.select(selected, item);
                    var e = {target: me.refs.container};
                    e.target.value = JSON.stringify({selected: selected});
                    // 刷一遍UI
                    me.___dispatchChange___(e);
                }
            }
        },
        onTreeChange: function (e) {
            var expand = (JSON.parse(e.target.value)).expand || {};
            this.setState({expand: expand});
        },
        onTreeAction: function (type, param) {
            // 更新数据源
            if (type === 'TreeLoadChildren' && typeof this.props.onAction === 'function') {
                this.props.onAction(type, param);
                return;
            }
            // 数据源为空，通知外部
            if (param.item.children instanceof Array && !param.item.children.length) {
                this.props.onAction('TreeLoadChildren', {index: param.index});
            }
            // 选择和反选
            var selected = (JSON.parse(this.___getValue___())).selected || {};
            this.props.selectorEngine[type === 'TreeSelectLeaf' ? 'select' : 'unselect'](selected, param.item);
            param.e.target = this.refs.container;
            param.e.target.value = JSON.stringify({selected: selected});
            this.___dispatchChange___(param.e);
        },
        render: function () {
            var selected = (JSON.parse(this.___getValue___())).selected || {};
            var value = {
                expand: this.state.expand,
                display: 'all',
                selected: selected
            };
            var treeProp1 = {
                datasource: this.props.datasource,
                value: JSON.stringify(value),
                leafRenderer: this.props.leafRenderer,
                onAction: this.onTreeAction,
                onChange: this.onTreeChange
            };
            value.display = 'selected';
            var treeProp2 = {
                datasource: this.props.datasource,
                value: JSON.stringify(value),
                leafRenderer: this.props.leafRenderer,
                onAction: this.onTreeAction,
                onChange: this.onTreeChange
            };
            return (
                <div {...cTools.containerBaseProps('dualtreeselector-test', this)}>
                    <div className="tree-container">
                        <Tree {...treeProp1}/>
                        <span className="cut-rule font-icon font-icon-caret-right"></span>
                        <Tree {...treeProp2}/>
                    </div>
                </div>
            );
        }
    });


});
