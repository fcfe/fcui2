/**
 * @file demo 中， 树控件相关的props定义
 * @author Han Bing Feng (hanbingfeng@)
 */

define(function (require) {
    var children = [
        {
            id: '1.1',
            name: 'Node 1.1',
            isChildrenLoaded: true
        },
        {
            id: '1.2',
            name: 'Node 1.2',
            isChildrenLoaded: true
        },
        {
            id: '1.3',
            name: 'Node 1.3',
            isChildrenLoaded: true
        }
    ];

    var exports = {
        tree: {
            treeNodes: [
                {
                    id: '1',
                    name: 'Node 1',
                    isChildrenLoading: true
                },
                {
                    id: '2',
                    name: 'Node 2',
                    children: [
                        {
                            id: '2.1',
                            name: 'Node 2.1'
                        },
                        {
                            id: '2.2',
                            name: 'Node 2.2'
                        }
                    ]
                }
            ]
        },

        dualTreeSelector: {
            leftTreeFilter: '1',
            treeNodes: [
                {
                    id: '1',
                    name: '1s后异步加载'
                },
                {
                    id: '2',
                    name: '有2个子节点的父节点',
                    children: [
                        {
                            id: '2.1',
                            name: 'Node 2.1'
                        },
                        {
                            id: '2.2',
                            name: 'Node 2.2'
                        }
                    ]
                },
                {
                    id: '3',
                    name: '没有子节点',
                    isChildrenLoaded: true
                }
            ],
            rightTreeLimit: 4,
            onRightTreeOverLimit: (num) => {
                console.warn('tree overlimit at', num);
            },
            onLeftTreeNodeExpand: function (treeNode, isExpanded) {
                if (isExpanded) {
                    if (treeNode.id === '1' && !treeNode.isChildrenLoaded) {
                        treeNode.isChildrenLoading = true;
                        this.forceUpdate();
                        setTimeout(() => {
                            treeNode.isChildrenLoading = false;
                            treeNode.isChildrenLoaded = true;
                            treeNode.children = children;
                            this.updateCache();
                            this.forceUpdate();
                        }, 1000);
                    }
                }
            },
            beforeTreeNodeSelect: function (treeNode) {
                if (treeNode.id === '1' && !treeNode.isChildrenLoaded) {
                    treeNode.isChildrenLoading = true;
                    this.forceUpdate();
                    setTimeout(() => {
                        treeNode.isChildrenLoading = false;
                        treeNode.isChildrenLoaded = true;
                        treeNode.children = children;
                        this.updateCache();
                        this.selectTreeNode(treeNode);
                    }, 1000);
                    return true;
                }
            }
        }
    };

    return exports;
});
