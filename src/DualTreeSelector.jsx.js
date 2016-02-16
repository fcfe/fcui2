/**
 * @file 双树选择器。
 * @author Han Bing Feng (hanbingfeng@baidu.com)
 */

define(function (require) {
    var u = require('underscore');
    var React = require('react');
    var Tree = require('./Tree.jsx');
    var util = require('./core/util.es6');

    var DualTreeSelector = React.createClass({
        propTypes: {
            /**
             * 左子树的初始节点列表
             */
            leftTreeNodes: React.PropTypes.arrayOf(Tree.treeNodeType),
            /**
             * 右子树的初始节点列表
             */
            rightTreeNodes: React.PropTypes.arrayOf(Tree.treeNodeType)
        },

        getDefaultProps: function () {
            return {};
        },

        getInitialState: function () {
            return u.chain(this.props)
                .pick('leftTreeNodes', 'rightTreeNodes')
                .mapObject(
                    (treeNodes) => util.tree.makeParentLink(treeNodes)
                ).value();
        },

        onTreeNodeRemoveClicked: function (treeNodes, tree, treeNode) {
            var sourceTreeNodes;
            var targetTreeNodes;
            if (this.refs.leftTree === tree) {
                sourceTreeNodes = this.state.leftTreeNodes;
                targetTreeNodes = this.state.rightTreeNodes;
            }
            else {
                sourceTreeNodes = this.state.rightTreeNodes;
                targetTreeNodes = this.state.leftTreeNodes;
            }
            // 从source tree挪走treeNode
            var {
                treeNodes: newSourceTreeNodes,
                removedTreeNode: removedSourceTreeNode
            } = util.tree.removeNodeFromTreeNodes(treeNode, sourceTreeNodes);

            var newTargetTreeNodes = targetTreeNodes.slice();
            util.tree.copyNodeToTreeNodes(
                util.tree.getPathToRoot(removedSourceTreeNode),
                newTargetTreeNodes
            );
            util.tree.makeParentLink(newTargetTreeNodes);
            var newState = this.refs.leftTree === tree
                ? {
                    leftTreeNodes: newSourceTreeNodes,
                    rightTreeNodes: newTargetTreeNodes
                }
                : {
                    leftTreeNodes: newTargetTreeNodes,
                    rightTreeNodes: newSourceTreeNodes
                };
            this.setState(newState);
        },

        render: function () {
            var props = {
                onTreeNodeRemoveClicked: this.onTreeNodeRemoveClicked
            };
            return <div className='fcui2-dual-tree-selector'>
                <Tree {...props} treeNodes={this.state.leftTreeNodes} ref='leftTree'/>
                <div className='fcui2-dual-tree-selector-separator'></div>
                <Tree {...props} treeNodes={this.state.rightTreeNodes} ref='rightTree' />
            </div>;
        }
    });

    return DualTreeSelector;
});
