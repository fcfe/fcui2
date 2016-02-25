/**
 * @file 双树选择器。
 * @author Han Bing Feng (hanbingfeng@baidu.com)
 */

define(function (require) {
    var _ = require('underscore');
    var React = require('react');
    var Tree = require('./Tree.jsx');
    var treeUtil = require('./core/treeUtil.es6');

    var DualTreeSelector = React.createClass({
        propTypes: {
            /**
             * 全部可选节点的列表
             */
            treeNodes: React.PropTypes.arrayOf(Tree.treeNodeType),
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
             * 右树的节点叶子限制
             */
            rightTreeLimit: React.PropTypes.number,
            /**
             * 已选节点的id集合
             */
            selectedTreeNodeId: React.PropTypes.objectOf(React.PropTypes.bool),
            /**
             * 当所做选择会使得右树超量时的回调，参数为超量后的右树叶子数
             */
            onRightTreeOverLimit: React.PropTypes.func,
            /**
             * 树节点选择动作开始前的回调，参数为被移动节点，可返回true阻止选择发生
             */
            beforeTreeNodeSelect: React.PropTypes.func,
            /**
             * 当树节点选择动作完成时的回调，参数为被移动节点
             */
            afterTreeNodeSelect: React.PropTypes.func,
            /**
             * 左树节点展开时的回调
             */
            onLeftTreeNodeExpand: React.PropTypes.func
        },

        getInitialState: function () {
            return {
                selectedTreeNodeId: this.props.selectedTreeNodeId || {}
            };
        },

        componentWillMount: function () {
            this.updateCache();
        },

        componentWillReceiveProps: function (nextProps) {
            this.setState(_.pick(nextProps, 'selectedTreeNodeId'));
            this.updateCache();
        },

        getDefaultProps: function () {
            return {
                leftTreeWidth: 310,
                rightTreeWidth: 310,
                height: 380,
                leftTreeTitle: '可选项目',
                rightTreeTitle: '已选项目',
                onLeftTreeNodeExpand: _.noop
            };
        },

        /**
         * 当this.props中的treeNodes发生了改变后，调用此方法更新本地的 parent cache 和 node cache。
         * TODO React Pioneers: 此方法的调用不应该是外部的责任。但目前props中的数据结构是mutable的，
         *  或者说不足够复杂，无法响应外部的修改，因此不得不让外部在修改了props中的数据结构以后调用此方法。
         *  我们下一个问题就需要考虑，如何为 fcui2 components 乃至更远的 React 业务 Components 设计
         *  通用的数据结构方案。
         */
        updateCache: function () {
            this._cache = treeUtil.getCache(this.props.treeNodes);
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

        render: function () {
            var {
                leftTreeWidth,
                rightTreeWidth,
                leftTreeTitle,
                rightTreeTitle,
                height,
                textLeftTreeSummary
            } = this.props;

            var selectedTreeNodes = treeUtil.getMarkedTreeNodes(
                this.props.treeNodes, this.state.selectedTreeNodeId, this._cache.parentCache, this._cache.nodeCache
            );

            return <div className='fcui2-dual-tree-selector'>
                <div className='fcui2-dual-tree-selector-left-tree-wrapper'>
                    <div className="fcui2-dual-tree-selector-tree-title">{leftTreeTitle}</div>
                    <Tree style={{width: leftTreeWidth, height: height}}
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
