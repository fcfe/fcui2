/**
 * @file 封装树及树选择器相关的方法
 * @author Han Bing Feng (hanbingfeng@)
 */
define(function (require) {
    var u = require('underscore');
    var exports = {

        /**
         * 将nodes中每个节点，放置一个parent属性连接到它的父节点。
         *
         * @param {Array<treeNode>} nodes 要连接的treeNode全体
         * @param {treeNode} parent 当前递归到的父节点
         * @return {Array<treeNode>} 连接好的treeNode全体
         */
        makeParentLink: function (nodes, parent) {
            nodes.forEach((node) => {
                if (node.children) {
                    exports.makeParentLink(node.children, node);
                }

                if (node.parent === parent || parent == null) {
                    return;
                }

                node.parent = parent;
            });
            return nodes;
        },

        /**
         * 从treeNodes集合中移除treeNode
         *
         * @param {treeNode} treeNode 待移除的treeNode
         * @param {Array<treeNode>} treeNodes 全体treeNodes
         * @param {boolean} shouldOnlyMarkIsRemoved 只标记isRemoved而不是真的移除节点
         * @return {Object} 移除treeNode后的全体treeNodes（keyed treeNodes）， 以及被移除的treeNode（keyed treeNode）。
         */
        removeNodeFromTreeNodes: function (treeNode, treeNodes, shouldOnlyMarkIsRemoved) {
            // 执行移除操作，返回移除后的nodes
            function performRemove(node, nodes) {
                if (shouldOnlyMarkIsRemoved) {
                    return nodes.map((n) => {
                        if (n.id === node.id) {
                            n.isRemoved = true;
                            if (n.children && n.children.length) {
                                // mark 所有的孩子
                            }
                        }
                        return n;
                    });
                }
                return nodes.filter((n) => n.id !== node.id);
            }
            if (treeNode.parent == null) {
                // 若treeNode没有parent， 则treeNodes深度为1， 直接移除
                return {
                    treeNodes: performRemove(treeNode, treeNodes),
                    removedTreeNode: treeNode
                };
            }

            var childrenLength = treeNode.parent.children.length;
            treeNode.parent.children.forEach((node) => {
                if (node.isRemoved) {
                    childrenLength--;
                }
            });

            if (childrenLength === 1) {
                if (shouldOnlyMarkIsRemoved) {
                    treeNode.parent.children = performRemove(treeNode, treeNode.parent.children);
                }
                return exports.removeNodeFromTreeNodes(treeNode.parent, treeNodes, shouldOnlyMarkIsRemoved);
            }

            treeNode.parent.children = performRemove(treeNode, treeNode.parent.children);
            return {
                treeNodes: treeNodes,
                removedTreeNode: treeNode
            };
        },

        /**
         * 将srcTreeNode从root到children拷贝到dstTreeNodes。
         *
         * @param {treeNode} srcTreeNode srcTreeNode
         * @param {treeNode} dstTreeNodes dstTreeNode
         */
        copyNodeToTreeNodes: function (srcTreeNode, dstTreeNodes) {
            var matchedTreeNode = dstTreeNodes.find((node) => node.id === srcTreeNode.id);
            if (matchedTreeNode == null) {
                matchedTreeNode = u.omit(srcTreeNode, 'parent', 'children', 'isRemoved');
                dstTreeNodes.push(matchedTreeNode);
            }
            matchedTreeNode.isRemoved = false;
            if (srcTreeNode.children && srcTreeNode.children.length) {
                if (matchedTreeNode.children == null) {
                    matchedTreeNode.children = [];
                }
                srcTreeNode.children.forEach((node) => {
                    exports.copyNodeToTreeNodes(
                        node,
                        matchedTreeNode.children
                    );
                });
            }
        },

        /**
         * 给定树节点，到树根为止制作一条路径，含有且只含有途径的每一个节点的拷贝。
         *
         * @param {treeNode} treeNode treeNode
         * @return {treeNode} 根节点
         */
        getPathToRoot: function (treeNode) {
            treeNode = u.extend({}, treeNode);
            while (treeNode.parent != null) {
                var parentNode = u.omit(treeNode.parent, 'children');
                parentNode.children = [treeNode];
                treeNode = parentNode;
            }
            return treeNode;
        }
    };

    return exports;
});
