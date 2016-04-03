/**
 * @file 封装树及树选择器相关的方法
 * @author Han Bing Feng (hanbingfeng@)
 */

define(function (require) {
    let _ = require('underscore');

    let exports = {};

    /**
     * 先深遍历所有节点。
     *
     * @param {Function} cb 回调函数
     * @param {treeNode} cb.node 当前访问的节点
     * @param {treeNode} cb.parentTreeNode 当前访问节点的父节点
     * @param {treeNode|Array<treeNode>} treeNodes treeNodes
     * @param {treeNode} parentTreeNode parentTreeNode
     */
    exports.walk = function (cb, treeNodes, parentTreeNode) {
        if (!_.isArray(treeNodes)) {
            treeNodes = [treeNodes];
        }
        treeNodes.forEach(node => {
            cb(node, parentTreeNode);
            // 向下访问所有的孩子
            if (node.children && node.children.length) {
                exports.walk(cb, node.children, node);
            }
        });
    },

    /**
     * 从treeNode起始标记节点及其所有孩子被选择。返回被选择的节点列表。
     *
     * @param {treeNode} treeNode 被选择的 tree node
     * @param {Array<treeNode>} parentTreeNodes 从根节点至treeNode父节点的数组
     * @param {Object} selectedTreeNodeId 已选的 tree node id 的集合
     * @return {Object} 加入了 treeNode 后的已选的 tree node id 的集合
     */
    exports.selectTreeNode = function (treeNode, parentTreeNodes, selectedTreeNodeId) {
        if (selectedTreeNodeId[treeNode.id]) {
            // 增加treeId到集合中，如果这个id已经加过，则它和它的孩子一定已经加过，不需要再处理。
            return selectedTreeNodeId;
        }

        let newMarked = {};

        // 首先标记当前节点的所有子节点
        exports.walk(node => {
            newMarked[node.id] = true;
        }, treeNode);

        // 向上检查所有parent
        function r(value, node) {
            return selectedTreeNodeId[node.id] ? value : value + 1;
        }

        for (let i = parentTreeNodes.length - 1; i >= 0; i--) {
            let parent = parentTreeNodes[i];
            if (parent.children && parent.children.length) {
                let unmarkedCount = parent.children.reduce(r, 0);
                if (unmarkedCount === 1) {
                    newMarked[parent.id] = true;
                }
                else {
                    break;
                }
            }
        }

        return _.extend(newMarked, selectedTreeNodeId);
    };

    /**
     * 从selectedTreeNodeId中移除treeNode。
     *
     * @param {treeNode} treeNode 待移除的treeNode
     * @param {Array<treeNode>} parentTreeNodes 从根节点至treeNode父节点的数组
     * @param {Object} selectedTreeNodeId 已选的 tree node id 的集合
     * @return {Object} 移除了 treeNode 后的已选的 tree node id 的集合
     */
    exports.unselectTreeNode = function (treeNode, parentTreeNodes, selectedTreeNodeId) {
        let toRemove = [];

        // 首先标记当前节点的所有子节点
        exports.walk(node => {
            toRemove.push(node.id);
        }, treeNode);

        // 向上去掉所有的parent
        parentTreeNodes.forEach(node => {
            toRemove.push(node.id);
        });

        return _.omit(selectedTreeNodeId, toRemove);
    };

    /**
     * 将treeComponent中， treeNode及其子节点展开。返回展开后的树节点集合。
     *
     * @param  {ReactComponent} treeComponent tree component
     * @param  {treeNode} treeNode 要展开的treeNode
     * @param {Array<treeNode>} parentTreeNodes 从根节点至treeNode父节点的数组
     * @return {Object} 新的展开的tree node id 数组
     */
    exports.getExpandedTreeNodeIdWithNodeExpanded = function (treeComponent, treeNode) {
        let newExpanded = {};

        exports.walk(node => {
            newExpanded[node.id] = true;
        }, treeNode);

        return _.extend(newExpanded, treeComponent.state.expandedTreeNodeId);
    };

    /**
     * 将dualTreeComponent中的右树， treeNode及其子节点展开。返回展开后的树节点集合。
     *
     * @param  {ReactComponent} dualTreeComponent tree component
     * @param  {treeNode} treeNode 要展开的treeNode
     * @param {Array<treeNode>} parentTreeNodes 从根节点至treeNode父节点的数组
     * @return {Object} 新的展开的tree node id 数组
     */
    exports.getExpandedTreeNodeIdWithNodeExpandedInRightTree = function (dualTreeComponent, treeNode) {
        return exports.getExpandedTreeNodeIdWithNodeExpanded(
            dualTreeComponent.refs.rightTree, treeNode
        );
    };

    /**
     * 将dualTreeComponent中的左树， treeNode及其子节点展开。返回展开后的树节点集合。
     *
     * @param  {ReactComponent} dualTreeComponent tree component
     * @param  {treeNode} treeNode 要展开的treeNode
     * @param {Array<treeNode>} parentTreeNodes 从根节点至treeNode父节点的数组
     * @return {Object} 新的展开的tree node id 数组
     */
    exports.getExpandedTreeNodeIdWithNodeExpandedInLeftTree = function (dualTreeComponent, treeNode) {
        return exports.getExpandedTreeNodeIdWithNodeExpanded(
            dualTreeComponent.refs.leftTree, treeNode
        );
    };

    return exports;
});
