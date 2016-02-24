/**
 * @file 封装树及树选择器相关的方法
 * @author Han Bing Feng (hanbingfeng@)
 */
define(function (require) {
    var _ = require('underscore');

    var exports = {

        /**
         * 先深遍历所有节点，遍历回调将发生在frozen transaction中，回调第1个参数为mutable的节点
         *
         * @param {Function} cb 回调函数
         * @param {treeNode} treeNode treeNode
         * @param {treeNode} parentTreeNode parentTreeNode
         */
        walk: function (cb, treeNode, parentTreeNode) {
            if (treeNode.id == null) {
                return;
            }
            if (cb(treeNode, parentTreeNode)) {
                return;
            }
            // 向下访问所有的孩子
            if (treeNode.children && treeNode.children.length) {
                treeNode.children.forEach(
                    (node) => exports.walk(cb, node, treeNode)
                );
            }
        },

        /**
         * 生成一个父子关系，以及tree id对tree节点的cache map
         *
         * @param {treeNode} treeNode treeNode
         * @return {Object} 父子关系map，子节点id做key，父节点实例做value，以及tree node id对tree node实例的cache
         */
        getCache: function (treeNodes) {
            var parentCache = {};
            var nodeCache = {};
            treeNodes.forEach((treeNode) => {
                nodeCache[treeNode.id] = treeNode;
                exports.walk((node, parentTreeNode) => {
                    nodeCache[node.id] = node;
                    if (parentTreeNode != null) {
                        parentCache[node.id] = parentTreeNode;
                    }
                }, treeNode);
            });
            return {
                parentCache: parentCache,
                nodeCache: nodeCache
            };
        },

        /**
         * 计数所有的叶子节点
         *
         * @param {treeNode} treeNode 计数起始的节点
         * @return {number} 叶子节点总数
         */
        countLeaf: function (treeNodes) {
            var count = 0;
            treeNodes.forEach((treeNode) => {
                if (!treeNode.children || treeNode.children.length === 0) {
                    count++;
                    return;
                }
                exports.walk((node) => {
                    if (!node.children || node.children.length === 0) {
                        count++;
                    }
                }, treeNode);
            });
            return count;
        },

        /**
         * 从treeNode起始做标记。会将treeNode的所有孩子以及treeNode的parent层叠或冒泡的做标记。
         *
         * @param {treeNode} treeNode 待移除的treeNode
         * @param {Object} markedTreeNodeId 已标记节点
         * @param {Object} parentCache parentCache
         * @param {string} bubbleOption，可为 bubbleWhenAllMarked 或 bubbleWhenNoneMarked
         *  当parent的所有节点都标记，或都不标记的时候，将parent做标记。
         * @return {Object} 新的做了标记的treeNodeId集合
         */
        _markNode: function (treeNode, markedTreeNodeId, parentCache, bubbleOption) {
            var newMarked = {};

            exports.walk((node) => {
                newMarked[node.id] = true;
            }, treeNode);

            // 返回node中未被标记的children的个数
            function countUnmarkedChildren(parent, marked) {
                return parent.children.reduce((value, node) => {
                    return marked[node.id] ? value : value + 1;
                }, 0);
            }

            // 向上检查所有parent
            var parent = parentCache[treeNode.id];
            while (parent != null) {
                if (parent.children && parent.children.length) {
                    var existingChildrenLength = countUnmarkedChildren(parent, markedTreeNodeId);
                    if (
                        bubbleOption === 'bubbleWhenAllMarked'
                        ? existingChildrenLength === 1
                        : existingChildrenLength === parent.children.length - 1
                    ) {
                        newMarked[parent.id] = true;
                        parent = parentCache[parent.id];
                    }
                    else {
                        break;
                    }
                }
            }
            return newMarked;
        },

        /**
         * 从treeNode起始标记节点及其所有孩子被移除。返回被移除的节点列表。
         *
         * @param {treeNode} treeNode 待移除的treeNode
         * @param {Object} removedTreeNodeId 待移除的
         * @param {Object} parentCache parentCache
         * @return {Object} 被移除了的节点的数组
         */
        markTreeNodeRemoved: function (treeNode, removedTreeNodeId, parentCache) {
            if (removedTreeNodeId[treeNode.id]) {
                // 增加treeId到集合中，如果这个id已经加过，则它和它的孩子一定已经加过，不需要再处理。
                return removedTreeNodeId;
            }

            return _.extend(exports._markNode(
                treeNode, removedTreeNodeId, parentCache, 'bubbleWhenAllMarked'
            ), removedTreeNodeId);
        },

        /**
         * 从removedTreeNodeId中移除treeNode。是markTreeNodeRemoved的反函数
         *
         * @param {treeNode} treeNode 待移除的treeNode
         * @param {Object} removedTreeNodeId 待移除的
         * @param {Object} parentCache parentCache
         * @return {Object} 移除了treeNode后的removedTreeNodeId集合
         */
        unmarkTreeNodeRemoved: function (treeNode, removedTreeNodeId, parentCache) {
            // 去掉treeId从集合中，即使当前treeId不在集合中，其孩子也可能在，继续处理以去掉孩子。
            return _.omit(removedTreeNodeId, Object.keys(exports._markNode(
                treeNode, removedTreeNodeId, parentCache, 'bubbleWhenNoneMarked'
            )));
        },

        /**
         * 获取已选择的tree。
         *
         * @param {Array<treeNode>} treeNodes 根节点
         * @param {Object} markedTreeNodeId markedTreeNodeId
         * @param {Object} parentCache parentCache
         * @param {Object} nodeCache nodeCache
         * @return {Array<treeNode>} 已选中树节点
         */
        getMarkedTreeNodes: function (treeNodes, markedTreeNodeId, parentCache, nodeCache) {
            var markedTreeNodes = [];
            var markedTreeNodesCache = {};

            // 从node开始，逆回根节点，将根节点插入markedTreeNodes
            function put(node) {
                if (markedTreeNodesCache[node.id]) {
                    return;
                }

                markedTreeNodesCache[node.id] = node;
                var parent = parentCache[node.id];
                if (parent == null) {
                    markedTreeNodes.push(node);
                    return;
                }

                if (markedTreeNodesCache[parent.id]) {
                    parent = markedTreeNodesCache[parent.id];
                    if (!parent.children) {
                        parent.children = [node];
                    }
                    else {
                        parent.children.push(node);
                    }
                    return;
                }

                parent = _.omit(parent, 'children');
                parent.children = [node];
                put(parent);
            }

            Object.keys(markedTreeNodeId).forEach((nodeId) => {
                var node = nodeCache[nodeId];
                if (node == null) {
                    return;
                }
                put(_.omit(node, 'children'));
            });

            return markedTreeNodes;
        }
    };

    return exports;
});
