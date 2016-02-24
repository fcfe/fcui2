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
             * 当树节点移动完成时的回调，参数为被移动节点，移动来源
             */
            onTreeNodeMoved: React.PropTypes.func
        },

        getInitialState: function () {
            return _.extend(
                {selectedTreeNodeId: this.props.selectedTreeNodeId || {}},
                treeUtil.getCache(this.props.treeNodes)
            );
        },

        componentWillReceiveProps: function (nextProps) {
            this.setState(
                _.extend(_.pick(nextProps, 'selectedTreeNodeId'), treeUtil.getCache(this.props.treeNodes))
            );
        },

        getDefaultProps: function () {
            return {
                leftTreeWidth: 310,
                rightTreeWidth: 310,
                height: 380,
                leftTreeTitle: '可选项目',
                rightTreeTitle: '已选项目'
            };
        },

        moveTreeNode: function (removedTreeNode, from) {
            function afterMove() {
                if (this.props.onTreeNodeMoved) {
                    this.props.onTreeNodeMoved.call(this, removedTreeNode, from);
                }
            }
            if (from === 'right') {
                this.setState({selectedTreeNodeId: treeUtil.unmarkTreeNodeRemoved(
                    removedTreeNode, this.state.selectedTreeNodeId, this.state.parentCache
                )}, afterMove);
                return;
            }

            var selectedTreeNodeId = treeUtil.markTreeNodeRemoved(
                removedTreeNode, this.state.selectedTreeNodeId, this.state.parentCache
            );

            if (this.props.rightTreeLimit != null) {
                var count = Object.keys(selectedTreeNodeId).reduce((count, nodeId) => {
                    var node = this.state.nodeCache[nodeId];
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
            var expandedTreeNodeId = this.refs.rightTree.state.expandedTreeNodeId;
            var newAdded = _.difference(selectedTreeNodeId, this.state.selectedTreeNodeId);
            var newExpanded = {};
            var treeNodes = treeUtil.getMarkedTreeNodes(
                this.props.treeNodes, newAdded, this.state.parentCache, this.state.nodeCache
            );
            treeUtil.walk((node) => {
                newExpanded[node.id] = true;
            }, treeNodes);
            this.setState({
                selectedTreeNodeId: selectedTreeNodeId
            }, afterMove);
            this.refs.rightTree.setState({
                expandedTreeNodeId: _.extend(newExpanded, expandedTreeNodeId)
            });
        },

        removeAll: function (from) {
            if (from === 'left') {
                throw new Error('从左树移除节点尚不支持。');
            }
            else {
                this.setState({selectedTreeNodeId: {}});
            }
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
                this.props.treeNodes, this.state.selectedTreeNodeId, this.state.parentCache, this.state.nodeCache
            );

            return <div className='fcui2-dual-tree-selector'>
                <div className='fcui2-dual-tree-selector-left-tree-wrapper'>
                    <div className="fcui2-dual-tree-selector-tree-title">{leftTreeTitle}</div>
                    <Tree style={{width: leftTreeWidth, height: height}}
                        treeNodes={this.props.treeNodes}
                        markedTreeNodeId={this.state.selectedTreeNodeId}
                        onTreeNodeOperationClicked={(treeNode) => {
                            this.moveTreeNode(treeNode, 'left');
                        }}
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
                            this.moveTreeNode(treeNode, 'right');
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
                                this.removeAll('right');
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
