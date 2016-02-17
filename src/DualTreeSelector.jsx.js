/**
 * @file 双树选择器。
 * @author Han Bing Feng (hanbingfeng@baidu.com)
 */

define(function (require) {
    var u = require('underscore');
    var React = require('react');
    var Tree = require('./Tree.jsx');
    var treeUtil = require('./core/treeUtil.es6');

    var DualTreeSelector = React.createClass({
        propTypes: {
            /**
             * 左子树的初始节点列表
             */
            leftTreeNodes: React.PropTypes.arrayOf(Tree.treeNodeType),
            /**
             * 右子树的初始节点列表
             */
            rightTreeNodes: React.PropTypes.arrayOf(Tree.treeNodeType),
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
            rightTreeTitle: React.PropTypes.string
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

        getInitialState: function () {
            return u.chain(this.props)
                .pick('leftTreeNodes', 'rightTreeNodes')
                .mapObject(
                    (treeNodes) => treeUtil.makeParentLink(treeNodes)
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
            } = treeUtil.removeNodeFromTreeNodes(treeNode, sourceTreeNodes, this.refs.leftTree === tree);

            var newTargetTreeNodes = targetTreeNodes.slice();
            treeUtil.copyNodeToTreeNodes(
                treeUtil.getPathToRoot(removedSourceTreeNode),
                newTargetTreeNodes
            );
            treeUtil.makeParentLink(newTargetTreeNodes);
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
            var {
                leftTreeWidth,
                rightTreeWidth,
                leftTreeTitle,
                rightTreeTitle,
                height
            } = this.props;

            var treeProps = {
                onTreeNodeRemoveClicked: this.onTreeNodeRemoveClicked
            };

            return <div className='fcui2-dual-tree-selector'>
                <div className='fcui2-dual-tree-selector-left-tree-wrapper'
                    style={{width: leftTreeWidth, height: height}}>
                <div className="fcui2-dual-tree-selector-tree-title">{leftTreeTitle}</div>
                <Tree {...treeProps}
                    className=''
                    treeNodes={this.state.leftTreeNodes}
                    ref='leftTree'/>
                </div>
                <div className='fcui2-dual-tree-selector-separator' style={{lineHeight: height + 'px'}}></div>
                <div className='fcui2-dual-tree-selector-right-tree-wrapper'
                    style={{width: rightTreeWidth, height: height}}>
                <div className="fcui2-dual-tree-selector-tree-title">{rightTreeTitle}</div>
                <Tree {...treeProps}
                    className='fcui2-dual-tree-selector-right-tree'
                    treeNodes={this.state.rightTreeNodes}
                    ref='rightTree' />
                </div>
                <div style={{clear: 'both'}}></div>
            </div>;
        }
    });

    return DualTreeSelector;
});
