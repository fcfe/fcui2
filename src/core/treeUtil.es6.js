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
         * @param {treeNode} cb.node 当前访问的节点
         * @param {treeNode} cb.parentTreeNode 当前访问节点的父节点
         * @param {treeNode|Array<treeNode>} treeNodes treeNodes
         * @param {treeNode} parentTreeNode parentTreeNode
         */
        walk: function (cb, treeNodes, parentTreeNode) {
            if (!_.isArray(treeNodes)) {
                treeNodes = [treeNodes];
            }
            treeNodes.forEach((node) => {
                cb(node, parentTreeNode);
                // 向下访问所有的孩子
                if (node.children && node.children.length) {
                    exports.walk(cb, node.children, node);
                }
            });
        },

        /**
         * 生成一个父子关系，以及tree id对tree节点的cache map。
         *
         * @param {treeNode} treeNodes tree nodes
         * @return {Object} map，父子关系cache和节点cache
         * @prop {Object} return.parentCache，子节点id做key，父节点实例做value
         * @prop {Object} return.nodeCache，tree node id对tree node实例的cache
         */
        getCache: function (treeNodes) {
            var parentCache = {};
            var nodeCache = {};
            exports.walk((node, parentTreeNode) => {
                nodeCache[node.id] = node;
                if (parentTreeNode != null) {
                    parentCache[node.id] = parentTreeNode;
                }
            }, treeNodes);

            return {
                parentCache: parentCache,
                nodeCache: nodeCache
            };
        },

        /**
         * 计数所有的叶子节点。
         *
         * @param {treeNode} treeNodes tree nodes
         * @return {number} 叶子节点总数
         */
        countLeaf: function (treeNodes) {
            var count = 0;
            exports.walk((node) => {
                if (!node.children || node.children.length === 0) {
                    count++;
                }
            }, treeNodes);

            return count;
        },

        /**
         * 从treeNode起始做标记。会将treeNode的所有孩子以及treeNode的parent层叠或冒泡的做标记。
         *
         * @param {treeNode} treeNode 待标记的tree node
         * @param {Object} markedTreeNodeId 已标记节点
         * @param {Object} parentCache parentCache
         * @param {string} bubbleOption，可为 bubbleWhenAllMarked 或 bubbleWhenNoneMarked
         *  当parent的所有节点都标记，或都不标记的时候，将parent做标记。
         * @return {Object} 新的做了标记的treeNodeId集合
         */
        _markNode: function (treeNode, markedTreeNodeId, parentCache, bubbleOption) {
            var newMarked = {};

            // 首先标记当前节点的所有子节点
            exports.walk((node) => {
                newMarked[node.id] = true;
            }, treeNode);

            // 计数parent中所有未被标记的子节点的个数
            function countUnmarkedChildren(parent, marked) {
                return parent.children.reduce((value, node) => {
                    return marked[node.id] ? value : value + 1;
                }, 0);
            }

            // 向上检查所有parent
            var parent = parentCache[treeNode.id];
            while (parent != null) {
                if (parent.children && parent.children.length) {
                    var unmarkedCount = countUnmarkedChildren(parent, markedTreeNodeId);
                    if (
                        bubbleOption === 'bubbleWhenAllMarked'
                        ? unmarkedCount === 1
                        : unmarkedCount === parent.children.length - 1
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
         * 从treeNode起始标记节点及其所有孩子被选择。返回被选择的节点列表。
         *
         * @param {treeNode} treeNode 被选择的 tree node
         * @param {Object} selectedTreeNodeId 已选的 tree node id 的集合
         * @param {Object} parentCache parentCache
         * @return {Object} 加入了 treeNode 后的已选的 tree node id 的集合
         */
        markTreeNodeSelected: function (treeNode, selectedTreeNodeId, parentCache) {
            if (selectedTreeNodeId[treeNode.id]) {
                // 增加treeId到集合中，如果这个id已经加过，则它和它的孩子一定已经加过，不需要再处理。
                return selectedTreeNodeId;
            }

            return _.extend(exports._markNode(
                treeNode, selectedTreeNodeId, parentCache, 'bubbleWhenAllMarked'
            ), selectedTreeNodeId);
        },

        /**
         * 从selectedTreeNodeId中移除treeNode。
         *
         * @param {treeNode} treeNode 待移除的treeNode
         * @param {Object} selectedTreeNodeId 已选的 tree node id 的集合
         * @param {Object} parentCache parentCache
         * @return {Object} 移除了 treeNode 后的已选的 tree node id 的集合
         */
        unmarkTreeNodeSelected: function (treeNode, selectedTreeNodeId, parentCache) {
            // 去掉treeId从集合中，即使当前treeId不在集合中，其孩子也可能在，继续处理以去掉孩子。
            return _.omit(selectedTreeNodeId, Object.keys(exports._markNode(
                treeNode, selectedTreeNodeId, parentCache, 'bubbleWhenNoneMarked'
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
