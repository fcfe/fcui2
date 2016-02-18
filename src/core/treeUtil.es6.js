/**
 * @file 封装树及树选择器相关的方法
 * @author Han Bing Feng (hanbingfeng@)
 */
define(function (require) {
    var _ = require('underscore');
    var Freezer = require('./freezer');
    var util = require('./util.es6');

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
            var freezer = new Freezer(treeNodes);
            return {
                treeNodesFreezer: freezer,
                treeNodes: freezer.get()
            };
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
         * 先深遍历所有节点，遍历回调将发生在frozen transaction中，回调第1个参数为mutable的节点
         * @param {treeNode} treeNode treeNode
         * @param {Function} cb cb
         * @return {treeNode} treeNode out of transaction
         */
        walk: function (treeNode, cb) {
            return util.doInFrozenTransaction(treeNode, (mutableTreeNode) => {
                cb(mutableTreeNode);
                // 向下访问所有的孩子
                if (mutableTreeNode.children && mutableTreeNode.children.length) {
                    mutableTreeNode.children.forEach(
                        (node) => exports.walk(node, cb)
                    );
                }
            });
        },

        /**
         * 从treeNodes集合中移除treeNode，只放置isRemoved标记而不是真的删除。
         *
         * @param {treeNode} treeNode 待移除的treeNode
         */
        markTreeNodeRemoved: function (treeNode) {
            assertFreezerFronzen(treeNode);

            treeNode = exports.walk(treeNode, (mutableNode) => {
                mutableNode.isRemoved = true;
            });

            // 向上检查所有parent
            var parent = exports.getParent(treeNode);
            while (parent != null) {
                if (parent.children && parent.children.length) {
                    var childrenLength = parent.children.reduce((value, treeNode) => {
                        return treeNode.isRemoved ? value : value + 1;
                    }, 0);
                    if (childrenLength === 0) {
                        parent = util.doInFrozenTransaction(parent, (mutableNode) => {
                            mutableNode.isRemoved = true;
                        });
                        parent = exports.getParent(parent);
                    }
                    else {
                        break;
                    }
                }
            }
        },

        /**
         * 从treeNodes集合中移除treeNode。
         *
         * @param {treeNode} treeNode treeNode
         */
        removeTreeNode: function (treeNode) {
            assertFreezerFronzen(treeNode);

            // 向上检查所有parent
            var parent = exports.getParent(treeNode);
            var child = treeNode;

            while (parent != null) {
                if (parent.children && parent.children.length) {
                    var childrenLength = parent.children.reduce((value, treeNode) => {
                        return treeNode.isRemoved ? value : value + 1;
                    }, 0);
                    if (childrenLength === 1) {
                        child = parent;
                        parent = exports.getParent(parent);
                    }
                    else {
                        break;
                    }
                }
            }
            // remove child from parent's children
            if (parent == null) {
                // child being this tree's only node
                child.__.parents[0].shift();
            }
            else {
                parent.children.splice(parent.children.indexOf(child), 1);
            }
        },

        /**
         * 将srcTreeNode从root到children拷贝到dstTreeNodes。
         *
         * @param {treeNode} srcTreeNode srcTreeNode
         * @param {treeNode} dstTreeNodes dstTreeNode
         */
        copyNodeToTreeNodes: function (srcTreeNode, dstTreeNodes) {
            util.doInFrozenTransaction(dstTreeNodes, (mutableTreeNodes) => {
                var matchedTreeNode = mutableTreeNodes.find((treeNode) => treeNode.id === srcTreeNode.id);
                if (matchedTreeNode == null) {
                    matchedTreeNode = _.omit(srcTreeNode, 'children', 'isRemoved');
                    mutableTreeNodes.push(matchedTreeNode);
                }
                util.doInFrozenTransaction(matchedTreeNode, (mutableNode) => {
                    mutableNode.isRemoved = false;
                    if (srcTreeNode.children && srcTreeNode.children.length) {
                        if (mutableNode.children == null) {
                            mutableNode.children = [];
                        }
                        srcTreeNode.children.forEach((node) => {
                            exports.copyNodeToTreeNodes(
                                node,
                                mutableNode.children
                            );
                        });
                    }
                });
            });

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
