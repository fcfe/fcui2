/**
 * @file 封装树及树选择器相关的方法
 * @author Han Bing Feng (hanbingfeng@)
 */
define(function (require) {
    var _ = require('underscore');
    var Freezer = require('./freezer');

    // 确保object被frozen过了
    function assertFreezerFronzen(object) {
        if (object.__ == null) {
            throw new Error('没有在', object, '中发现"__"，用Freezer包装过了吗？');
        }
    }

    var exports = {

        /**
         * 返回Freezer包装了的treeNodes。
         *
         * @param {Array<treeNode>} treeNodes treeNodes
         * @return {Frozen} frozen的treeNodes
         */
        getFrozenTreeNodes: function (treeNodes) {
            return new Freezer(treeNodes).get();
        },

        /**
         * NASTY!! 从Freezer在节点中放置的私有parents属性里拿父节点，只返回object的parent
         *
         * @param {Object} object treeNode
         * @return {treeNode} 父节点，或者null，如果没有父节点或者出错了
         */
        getParent: function (object) {
            assertFreezerFronzen(object);

            var parents = object.__.parents;
            if (parents == null) {
                throw new Error('没有在"__"', object.__, '中发现parents，Freezer改了吗？');
            }

            if (parents.length > 1) {
                console.warn('parents', parents, '长度大于1了，只返回第一个object parent');
            }

            if (_.isArray(parents[0])) {
                return exports.getParent(parents[0]);
            }

            return parents[0];
        },

        /**
         * 从treeNodes集合中移除treeNode，只放置isRemoved标记而不是真的删除。
         *
         * @param {treeNode} treeNode 待移除的treeNode
         */
        markTreeNodeRemoved: function (treeNode) {
            assertFreezerFronzen(treeNode);

            treeNode.set('isRemoved', true);
            // 向下移除所有的孩子
            if (treeNode.children && treeNode.children.length) {
                treeNode.children.forEach((node) => {
                    exports.markTreeNodeRemoved(node);
                });
            }
            // 向上检查所有parent
            var parent = exports.getParent(treeNode);
            while (parent != null) {
                if (parent.children && parent.children.length) {
                    var childrenLength = parent.children.reduce((value, treeNode) => {
                        return treeNode.isRemoved ? value : value + 1;
                    }, 0);
                    if (childrenLength === 0) {
                        parent.set('isRemoved', true);
                        parent = exports.getParent(parent);
                    }
                    else {
                        break;
                    }
                }
            }
        },

        /**
         * 将srcTreeNode从root到children拷贝到dstTreeNodes。
         *
         * @param {treeNode} srcTreeNode srcTreeNode
         * @param {treeNode} dstTreeNodes dstTreeNode
         */
        copyNodeToTreeNodes: function (srcTreeNode, dstTreeNodes) {
            var matchedTreeNode = dstTreeNodes.find((treeNode) => treeNode.id === srcTreeNode.id);
            if (matchedTreeNode == null) {
                matchedTreeNode = _.omit(srcTreeNode, 'children', 'isRemoved');
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
         * 给定树节点，到树根为止制作一条路径，含有且只含有途径的每一个节点的拷贝。***但是***，给定树节点可能的有的孩子没有拷贝。
         *
         * @param {treeNode} treeNode treeNode
         * @return {treeNode} 根节点
         */
        getPathToRoot: function (treeNode) {
            var clonedTreeNode = _.extend({}, treeNode);
            var parentTreeNode = exports.getParent(treeNode);
            while (parentTreeNode != null) {
                var tmpTreeNode = _.omit(parentTreeNode, 'children');
                tmpTreeNode.children = [clonedTreeNode];
                parentTreeNode = exports.getParent(parentTreeNode);
                clonedTreeNode = tmpTreeNode;
            }
            return clonedTreeNode;
        }
    };

    return exports;
});
