

define(function (require) {
    let _ = require('underscore');

    let exports = {};
/*
 *  封装树及树选择器相关的方法
 * @author Han Bing Feng (hanbingfeng@)
 */
    /*
     * 先深遍历所有节点
     *
     * @param {Function} cb 回调函数
     * @param {treeNode} cb.node 当前访问的节点
     * @param {treeNode} cb.parentTreeNodes 从根开始的当前访问节点的父节点数组
     * @param {treeNode|Array<treeNode>} treeNodes treeNodes
     * @param {treeNode} parentTreeNode parentTreeNode
     */
    exports.walk = function (cb, treeNodes, parentTreeNodes) {
        if (!_.isArray(treeNodes)) {
            treeNodes = [treeNodes];
        }
        if (parentTreeNodes == null) {
            parentTreeNodes = [];
        }
        treeNodes.forEach(node => {
            cb(node, parentTreeNodes);
            // 向下访问所有的孩子
            if (node.children && node.children.length) {
                exports.walk(cb, node.children, parentTreeNodes.concat(node));
            }
        });
    },

    /*
     * 从treeNode起始标记节点及其所有孩子被选择返回被选择的节点列表
     *
     * @param {treeNode} treeNode 被选择的 tree node
     * @param {Array<treeNode>} parentTreeNodes 从根节点至treeNode父节点的数组
     * @param {Object} selectedTreeNodeId 已选的 tree node id 的集合
     * @return {Object} 加入了 treeNode 后的已选的 tree node id 的集合
     */
    exports.selectTreeNode = function (treeNode, parentTreeNodes, selectedTreeNodeId) {
        if (selectedTreeNodeId[treeNode.id]) {
            // 增加treeId到集合中，如果这个id已经加过，则它和它的孩子一定已经加过，不需要再处理
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

    /*
     * 从selectedTreeNodeId中移除treeNode
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

    /*
     * 返回新的expandedTreeNodeId， 展开刚刚选择的节点
     *
     * @param {ReactComponent} dualTreeComponent tree component
     * @param {Object} originSelected 前一展开转台
     * @param {Object} newSelected 新的展开状态
     * @return {Object} 新的展开的tree node id 数组
     */
    exports.getExpandedTreeNodeIdAfterSelect = function (dualTreeComponent, originSelected, newSelected) {
        // 取new中有，origin中没有的项
        let diff = _.omit(newSelected, Object.keys(originSelected));
        return _.extend(diff, dualTreeComponent.refs.rightTree.state.expandedTreeNodeId);
    };

    /*
     * 先深遍历所有已选节点
     *
     * @param {Function} cb 回调函数
     * @param {treeNode} cb.node 当前访问的节点
     * @param {treeNode} cb.parentTreeNodes 从根开始的当前访问节点的父节点数组
     * @param {Array<treeNodes>} treeNodes 树节点全集
     * @param {Object} selectedTreeNodeId 已选树节点集合
     */
    exports.walkSelected = function (cb, treeNodes, selectedTreeNodeId) {
        exports.walk((node, parentTreeNodes) => {
            if (selectedTreeNodeId[node.id]) {
                cb(node, parentTreeNodes);
            }
        }, treeNodes);
    };

    /*
     * 获得已选树结构
     * @param {Array<treeNodes>} treeNodes 树节点全集
     * @param {Object} selectedTreeNodeId 已选树节点集合
     * @return {Array<treeNodes>} 已选树结构
     */
    exports.getSelectedTree = function (treeNodes, selectedTreeNodeId) {
        let selectedTreeNodes = [];
        exports.walkSelected((selectedNode, parentTreeNodes) => {
            let dstNodes = selectedTreeNodes;
            parentTreeNodes.concat(selectedNode).forEach(sourceNode => {
                let node = _.find(dstNodes, n => n.id === sourceNode.id);
                if (node == null) {
                    node = _.omit(sourceNode, 'children');
                    node.children = [];
                    dstNodes.push(node);
                }
                dstNodes = node.children;
            });
        }, treeNodes, selectedTreeNodeId);

        return selectedTreeNodes;
    };

    /*
     * 计数已选的叶子节点
     *
     * @param {Array<treeNodes>} treeNodes 树节点全集
     * @param {Object} selectedTreeNodeId 已选树节点集合
     * @return {number} 叶子节点数目
     */
    exports.countSelectedLeaf = function (treeNodes, selectedTreeNodeId) {
        let count = 0;
        exports.walkSelected(node => {
            if (node.isChildrenLoaded && (node.children == null || node.children.length === 0)) {
                count++;
            }
        }, treeNodes, selectedTreeNodeId);
        return count;
    };

    return exports;
});
