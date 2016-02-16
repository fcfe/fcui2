define(function (require) {
    var u = require('underscore');
    var exports = {

        /**
         * 获取dom节点的位置
         *
         * @param {HtmlElement} el dom节点
         * @return {Object} 位置对象，left、top相对于body左上角；x、y相对于可见区域左上角;
         */
        getDOMPosition: function (el) {
            var x = 0, y = 0;
            while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
                x += el.offsetLeft - el.scrollLeft;
                y += el.offsetTop - el.scrollTop;
                el = el.offsetParent;
            }
            return {
                x: x,
                y: y,
                left: x + document.body.scrollLeft,
                top: y + document.body.scrollTop
            }
        },

        /**
         * 获取DOM节点dataset，shit IE9
         *
         * @param {HtmlElement} dom dom节点
         * @return {Object} dataset数据集
         */
        getDataset: function (dom) {
            if (typeof dom.dataset !== 'undefined') {
                return dom.dataset;
            }
            var attrs = dom.attributes;
            var dataset = {};
            for (var i = 0; i < attrs.length; i++) {
                var item = attrs[i];
                var key = item.name;
                if (key.indexOf('data-') !== 0) {
                    continue;
                }
                key = key.slice(5, key.length).replace(/\-(\w)/g, function (all, letter) {
                    return letter.toUpperCase();
                });
                dataset[key] = item.value;
            }
            return dataset;
        },

        /**
         * 自动调整弹出浮层位置，只调整上下，不调整左右
         *
         * @param {HtmlElement} container layer外部的dom容器
         * @param {HtmlElement} layer layer根容器
         * @param {React Node} node layer所在的react组件
         */
        fixedLayerPositionTB: function (container, layer, node) {
            var pos = this.getDOMPosition(container);
            var timer = setInterval(function () {
                var height = layer.offsetHeight;
                if (height === 0) return;
                clearInterval(timer);
                var position = pos.y + container.offsetHeight + height < document.documentElement.clientHeight
                    ? 'bottom-layer' : 'up-layer';
                node.setState({layerPosition: position});
            }, 5);
        },

        /**
         * 封装树及树选择器相关的方法
         */
        tree: {
            /**
             * 将nodes中每个节点，放置一个parent属性连接到它的父节点。
             *
             * @param {Array<treeNode>} nodes 要连接的treeNode全体
             * @param {treeNode} nodes 当前递归到的父节点
             * @return {Array<treeNode>} 连接好的treeNode全体
             */
            makeParentLink: function (nodes, parent) {
                nodes.forEach((node) => {
                    if (node.children) {
                        exports.tree.makeParentLink(node.children, node);
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
                    return exports.tree.removeNodeFromTreeNodes(treeNode.parent, treeNodes, shouldOnlyMarkIsRemoved);
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
                        exports.tree.copyNodeToTreeNodes(
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
        }
    };

    return exports;
});
