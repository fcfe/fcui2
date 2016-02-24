/**
 * @file demo 中， 树控件相关的props定义
 * @author Han Bing Feng (hanbingfeng@)
 */

define(function (require) {
    var treeNodes = [
        {
            id: '1',
            name: 'Node 1',
            isChildrenLoading: true
        },
        {
            id: '2',
            name: 'Node 2',
            isExpanded: true,
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
    ];

    var exports = {
        tree: {
            treeNodes: treeNodes
        },

        dualTreeSelector: {
            treeNodes: treeNodes
        }
    };

    return exports;
});
