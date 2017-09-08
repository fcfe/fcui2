/**
 * 双树选择器
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2.1
 */
define(function (require) {


    var _ = require('underscore');
    var React = require('react');
    var cTools = require('./core/componentTools');
    var Tree = require('./Tree.jsx');
    var Renderer = require('./components/tree/SelectRenderer.jsx');
    var InputWidget = require('./mixins/InputWidget');
    var tools = require('./core/treeTools');


    return React.createClass({
        /**
         * @properties
         * @param {Import|Properties} src\core\componentTools.js skin className style disabled
         * @param {Import|Properties} src\Tree.jsx.js datasource onAction leafRenderer
         * @param {Object} selectorEngine 选择逻辑引擎，见src\core\treeTools.js dualTreeSelectorEngine
         * @param {Import|Properties} src\mixins\InputWidget.js value onChange name validations customErrorTemplates valueTemplate
         */
        /**
         * @fire Import src\mixins\InputWidget.js XXX onChange
         */
        /**
         * @structure Import src\Tree.jsx.js TreeItemObject
         */
        /**
         * @structure DualTreeSelectorValueTemplate
         * @example
         *  {
         *      selected: <optional>
         *  }
         * @attention DualTreeSelector的value类型是字符串，用JSON.stringify方法将示例中的数据结构转换，因此操作value时不能出环
         * @param {Object} selected 树的选中状态，以TreeItemObject.value为key，存在的key表示该叶子被选中
         */
        // @override
        contextTypes: {
            appSkin: React.PropTypes.string
        },
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
            var datasource = this.props.datasource;
            if (!this.___lastDatasource___) {
                this.___lastDatasource___ = JSON.stringify(datasource);
                return;
            }
            var lastDatasource = JSON.parse(this.___lastDatasource___);
            if (_.isEqual(lastDatasource, datasource)) return;
            var selected = JSON.parse(this.___getValue___() || '{}').selected || {};
            // 检查selected中标记为1的item的children是否加载完毕了。
            if (tools.targetAsyncLeaf(selected, this.props.selectorEngine, datasource)) {
                this.___lastDatasource___ = JSON.stringify(datasource);
                var me = this;
                var e = {target: this.refs.container};
                e.target.value = JSON.stringify({selected: selected});
                setTimeout(function () {
                    me.___dispatchChange___(e);
                }, 200);
            }
        },
        /**
         * @fire DualTreeSelector onAction
         * @param {String} type 回调类型
         * TreeExpandNode：树节点展开
         * @param {Object} param 回调参数
         * @param {Object} param.expand 树展开节点hash; type='TreeExpandNode'
         */
        onTreeChange: function (e) {
            var expand = (JSON.parse(e.target.value  || '{}')).expand || {};
            this.setState({expand: expand});
            typeof this.props.onAction === 'function' && this.props.onAction('TreeExpandNode', {expand: expand});
        },
        /**
         * @fire DualTreeSelector onAction
         * @param {String} type 回调类型
         * TreeLoadChildren：加载子树数据源
         * @param {Object} param 回调参数
         * @param {Array.<String>} param.index 子树序列; type='TreeLoadChildren'
         */
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
            var selected = (JSON.parse(this.___getValue___()  || '{}')).selected || {};
            this.props.selectorEngine[type === 'TreeSelectLeaf' ? 'select' : 'unselect'](selected, param.item);
            param.e = {target: this.refs.container};
            param.e.target.value = JSON.stringify({selected: selected});
            this.___dispatchChange___(param.e);
        },
        render: function () {
            var selected = (JSON.parse(this.___getValue___() || '{}')).selected || {};
            var value = {
                expand: this.state.expand,
                display: 'all',
                selected: selected
            };
            var treeProp1 = {
                disabled: this.props.disabled,
                datasource: this.props.datasource,
                value: JSON.stringify(value),
                leafRenderer: this.props.leafRenderer,
                onAction: this.onTreeAction,
                onChange: this.onTreeChange
            };
            value.display = 'selected';
            var treeProp2 = {
                disabled: this.props.disabled,
                datasource: this.props.datasource,
                value: JSON.stringify(value),
                leafRenderer: this.props.leafRenderer,
                onAction: this.onTreeAction,
                onChange: this.onTreeChange
            };
            return (
                <div {...cTools.containerBaseProps('dualtreeselector', this)}>
                    <div className="tree-container">
                        <Tree {...treeProp1}/>
                        <span className="cut-rule fcui2-icon fcui2-icon-arrow-right"></span>
                        <Tree {...treeProp2}/>
                    </div>
                </div>
            );
        }
    });


});
