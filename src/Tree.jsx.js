/**
 * @file 一个树形选择控件。
 * @author Han Bing Feng (hanbingfeng@baidu.com)
 */
/* global React */
define(function () {
    var u = require('underscore');
    var treeNode = React.PropTypes.shape({
        id: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.number
        ]),
        name: React.PropTypes.string,
        isExpanded: React.PropTypes.bool,
        isChildrenLoading: React.PropTypes.bool,
        isChildrenLoaded: React.PropTypes.bool,
        isRemovable: React.PropTypes.bool,
        children: React.PropTypes.arrayOf(treeNode),
        parent: treeNode
    });

    var Tree = React.createClass({
        propTypes: {
            /**
             * 树所展现的所有节点集合
             */
            treeNodes: React.PropTypes.arrayOf(treeNode),
            /**
             * 当前树所在的层数
             */
            treeLevel: React.PropTypes.number,
            /**
             * 树是否支持节点移除，默认为true
             */
            isTreeNodesRemovable: React.PropTypes.bool,
            /**
             * 根据节点的层数，计算当前层的wrapper的style
             */
            getTreeLevelStyle: React.PropTypes.func,
            /**
             * 节点展开时的回调。
             * @param node treeNode
             * @param treeNodes
             */
            onTreeNodeExpand: React.PropTypes.func
        },

        getDefaultProps: function () {
            return {
                treeLevel: 0,
                isTreeNodesRemovable: true,
                onTreeNodeExpand: u.noop,
                getTreeLevelStyle: function (level) {
                    return {
                        marginLeft: (level * 2) + 'em'
                    };
                }
            };
        },

        render: function () {
            var {
                treeNodes,
                isTreeNodesRemovable,
                treeLevel,
                getTreeLevelStyle,
                onTreeNodeExpand,
                ...other
            } = this.props;

            var nextTreeLevel = treeLevel + 1;

            return (
                <div {...other}
                    data-tree-level={treeLevel}
                    style={getTreeLevelStyle(treeLevel)}
                    className={treeLevel > 0 ? 'fcui2-tree fcui2-tree-inner' : 'fcui2-tree'}
                >
                    {treeNodes.map((node) => {
                        return <div key={node.id}><Tree.TreeNode {...node}
                            isTreeNodesRemovable={isTreeNodesRemovable}
                            onTreeNodeExpand={onTreeNodeExpand}
                            treeLevel={treeLevel}
                        />{node.isExpanded && node.children && node.children.length
                            ? <Tree {...this.props} treeNodes={node.children} treeLevel={nextTreeLevel} />
                            : ''
                        }</div>;
                    })}
                </div>
            );
        }
    });

    Tree.TreeNode = React.createClass({
        getDefaultProps: function () {
            return {
                isExpanded: false,
                isChildrenLoading: false,
                isChildrenLoaded: false
            };
        },

        render: function () {
            var {
                id,
                name,
                isExpanded,
                isChildrenLoading,
                isChildrenLoaded,
                isRemovable,
                isTreeNodesRemovable,
                children,
                parent,
                treeLevel,
                onTreeNodeExpand,
                ...other
            } = this.props;

            if (isRemovable == null) {
                isRemovable = isTreeNodesRemovable;
            }

            return (
                <div {...other} className='fcui2-tree-node'>
                    <span className={isExpanded ? 'fcui2-tree-node-expanded' : 'fcui2-tree-node-collapse'}
                        onClick={onTreeNodeExpand(this.props)}
                    ></span>
                    <span className='fcui2-tree-node-name'>{name}</span>
                    {isChildrenLoading
                        ? <span className='fcui2-tree-node-loading'>加载中...</span>
                        : ''
                    }
                    {isRemovable
                        ? <span className='fcui2-tree-node-remove-handle'></span>
                        : ''
                    }
                </div>
            );
        }
    });

    return Tree;
});
