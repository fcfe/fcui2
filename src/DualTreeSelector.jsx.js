/**
 * @file 双树选择器。
 * @author Han Bing Feng (hanbingfeng@baidu.com)
 */

define(function (require) {
    let _ = require('underscore');
    let React = require('react');
    var InputWidgetBase = require('./mixins/InputWidgetBase');
    var InputWidgetInForm = require('./mixins/InputWidgetInForm');
    let Tree = require('./Tree.jsx');

    let DualTreeSelector = React.createClass({
        propTypes: {
            /**
             * 全部可选节点的列表
             */
            treeNodes: React.PropTypes.arrayOf(Tree.treeNodeType),
            /**
             * 已选节点的id集合
             */
            value: React.PropTypes.objectOf(React.PropTypes.bool),
            /**
             * 左树的tree node name filter。
             */
            leftTreeFilter: React.PropTypes.string,
            /**
             * 左子树的宽度，px
             */
            leftTreeWidth: React.PropTypes.number,
            /**
             * 右子树的宽度，px
             */
            rightTreeWidth: React.PropTypes.number,
            /**
             * 选择器中树的高度，px
             */
            height: React.PropTypes.number,
            /**
             * 左树的标题
             */
            leftTreeTitle: React.PropTypes.string,
            /**
             * 右树的标题
             */
            rightTreeTitle: React.PropTypes.string,
            /**
             * 左树左下角的提示话术
             */
            textLeftTreeSummary: React.PropTypes.string,
            /**
             * 左树左下角的提示话术
             */
            leftTreeSummary: React.PropTypes.string,
            /**
             * 右树右下角的提示话术
             */
            rightTreeSummary: React.PropTypes.string,
            /**
             * 树点击选择按钮后的回调。
             * @param {object} onChange.e 选择后的树节点
             */
            onChange: React.PropTypes.func,
            /**
             * 左树节点展开时的回调
             * @param {SyntheticEvent} onLeftTreeNodeExpand.e 点击事件对象
             * @param {treeNodeType} onLeftTreeNodeExpand.treeNode 被操作的树节点数据
             * @param {Array<treeNodeType>} onLeftTreeNodeExpand.parentTreeNodes 当前节点的父节点列表
             */
            onLeftTreeNodeExpand: React.PropTypes.func
        },

        mixins: [InputWidgetBase, InputWidgetInForm],

        getDefaultProps() {
            return {
                leftTreeWidth: 310,
                rightTreeWidth: 310,
                height: 380,
                leftTreeTitle: '可选项目',
                rightTreeTitle: '已选项目',
                onTreeNodeSelect: _.noop,
                afterTreeNodeSelect: _.noop,
                onLeftTreeNodeExpand: _.noop
            };
        },

        /**
         * 选择一个树节点。
         *
         * @param {treeNode} selectedTreeNode selected tree node
         */
        selectTreeNode: function (selectedTreeNode) {
            if (this.props.beforeTreeNodeSelect) {
                if (this.props.beforeTreeNodeSelect.call(this, selectedTreeNode)) {
                    return;
                }
            }

            var selectedTreeNodeId = treeUtil.markTreeNodeSelected(
                selectedTreeNode, this.state.selectedTreeNodeId, this._cache.parentCache
            );

            if (this.props.rightTreeLimit != null) {
                var count = Object.keys(selectedTreeNodeId).reduce((count, nodeId) => {
                    var node = this._cache.nodeCache[nodeId];
                    if (node && (!node.children || node.children.length === 0)) {
                        return ++count;
                    }
                    return count;
                }, 0);
                if (count > this.props.rightTreeLimit) {
                    this.props.onRightTreeOverLimit && this.props.onRightTreeOverLimit(count);
                    return;
                }
            }

            // 同时让挪到右边的节点都展开，将新加入的节点id加入expanded tree node id
            // 得出本次选择所新增的树节点
            var newAdded = _.omit(selectedTreeNodeId, Object.keys(this.state.selectedTreeNodeId));
            var newExpanded = {};
            // 得到新增的树节点的树结构
            var treeNodes = treeUtil.getMarkedTreeNodes(
                this.props.treeNodes, newAdded, this._cache.parentCache, this._cache.nodeCache
            );
            // 展开树结构上每一个节点
            treeUtil.walk((node) => {
                newExpanded[node.id] = true;
            }, treeNodes);
            // 更改右树的展开状态
            this.refs.rightTree.setState({
                expandedTreeNodeId: _.extend(
                    newExpanded, this.refs.rightTree.state.expandedTreeNodeId
                )
            });
            this.setState({
                selectedTreeNodeId: selectedTreeNodeId
            }, () => {
                this.props.afterTreeNodeSelect && this.props.afterTreeNodeSelect.call(this, selectedTreeNode);
            });
        },

        /**
         * 取消选择一个树节点。
         *
         * @param {treeNode} unselectTreeNode unselected tree node
         */
        unselectTreeNode: function (unselectTreeNode) {
            this.setState({selectedTreeNodeId: treeUtil.unmarkTreeNodeSelected(
                unselectTreeNode, this.state.selectedTreeNodeId, this._cache.parentCache
            )});
        },

        /**
         * 取消选择全部树节点。
         */
        unselectAll: function () {
            this.setState({selectedTreeNodeId: {}});
        },

        /**
         * 作为表单域，得到当前表单值
         *
         * @return {Object} 已选的树节点 id 集合。它是this.state中所存集合的一个拷贝。
         */
        getValue: function () {
            // 复制？不复制？这是个问题。。
            return _.extend({}, this.state.selectedTreeNodeId);
        },

        render() {
            let {
                leftTreeWidth,
                rightTreeWidth,
                leftTreeTitle,
                rightTreeTitle,
                height,
                ...others
            } = this.props;

            var selectedTreeNodes = treeUtil.getMarkedTreeNodes(
                this.props.treeNodes, this.state.selectedTreeNodeId, this._cache.parentCache, this._cache.nodeCache
            );

            return <div className='fcui2-dual-tree-selector'>
                <div className='fcui2-dual-tree-selector-left-tree-wrapper'>
                    <div className="fcui2-dual-tree-selector-tree-title">{leftTreeTitle}</div>
                    <Tree style={{width: leftTreeWidth, height: height}}
                        nameFilter={this.props.leftTreeFilter}
                        treeNodes={this.props.treeNodes}
                        markedTreeNodeId={this.state.selectedTreeNodeId}
                        onTreeNodeOperationClicked={(treeNode) => {
                            this.selectTreeNode(treeNode);
                        }}
                        onTreeNodeExpandClicked={this.props.onLeftTreeNodeExpand.bind(this)}
                        ref='leftTree' />
                    <div className='fcui2-dual-tree-selector-tree-footer'>
                        <span className='fcui2-dual-tree-selector-tree-footer-summary'>{textLeftTreeSummary}</span>
                    </div>
                </div>
                <div className='fcui2-dual-tree-selector-separator' style={{lineHeight: height + 'px'}}></div>
                <div className='fcui2-dual-tree-selector-right-tree-wrapper'>
                    <div className='fcui2-dual-tree-selector-tree-title'>{rightTreeTitle}</div>
                    <Tree style={{width: rightTreeWidth, height: height}}
                        treeNodes={selectedTreeNodes}
                        onTreeNodeOperationClicked={(treeNode) => {
                            this.unselectTreeNode(treeNode);
                        }}
                        ref='rightTree' />
                    <div className='fcui2-dual-tree-selector-tree-footer'>
                        <span className='fcui2-dual-tree-selector-tree-footer-summary'>
                            {treeUtil.countLeaf(selectedTreeNodes)}
                            {this.props.rightTreeLimit
                                ? ' / ' + this.props.rightTreeLimit
                                : ''}
                        </span>
                        <span className='fcui2-dual-tree-selector-tree-footer-remove-all'>
                            <a href='javascript:;' onClick={() => {
                                this.unselectAll();
                            }}>全部删除</a>
                        </span>
                    </div>
                </div>
                <div style={{clear: 'both'}}></div>
            </div>;
        }
    });

    return DualTreeSelector;
});
