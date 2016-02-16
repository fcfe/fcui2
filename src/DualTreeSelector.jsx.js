/**
 * @file 双树选择器。
 * @author Han Bing Feng (hanbingfeng@baidu.com)
 */

define(function (require) {
    var u = require('underscore');
    var React = require('react');
    var Tree = require('./Tree.jsx');

    function makeParentLink(nodes, parent) {
        nodes.forEach((node) => {
            if (node.children) {
                makeParentLink(node.children, node);
            }

            if (node.parent != null || parent == null) {
                return;
            }

            node.parent = parent;
        });
    }

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
            return u.pick(this.props, 'leftTreeNodes', 'rightTreeNodes');
        },

        onTreeNodeRemoveClicked: function (treeNodes, tree, treeNode) {
            var source = tree;
            var target = this.refs.leftTree === source ? this.refs.rightTree : this.refs.leftTree;


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
