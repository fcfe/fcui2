/**
 * @file 一个树形选择控件。
 * @author Han Bing Feng (hanbingfeng@baidu.com)
 */
/* global React */
define(function (require) {
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
        children: React.PropTypes.arrayOf(treeNode)
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
             * @param node 当前被展开的treeNode
             * @param treeNodes 全体treeNode
             */
            onTreeNodeExpandClicked: React.PropTypes.func,
            /**
             * 节点被删除时的回调
             * @param node 当前被删除的treeNode
             * @param treeNodes 全体treeNode
             */
            onTreeNodeRemoveClicked: React.PropTypes.func
        },

        getDefaultProps: function () {
            return {
                treeLevel: 0,
                isTreeNodesRemovable: true,
                onTreeNodeExpandClicked: u.noop,
                onTreeNodeRemoveClicked: u.noop,
                onTreeNodeClicked: u.noop,
                getTreeLevelStyle: function (level) {
                    return {
                        marginLeft: (level * 2) + 'em'
                    };
                }
            };
        },

        getInitialState: function () {
            return {};
        },

        componentWillMount: function () {
            if (this.props.treeLevel === 0) {
                this._handlers = u.chain(this.props)
                    .pick('onTreeNodeExpandClicked', 'onTreeNodeRemoveClicked', 'onTreeNodeClicked')
                    .mapObject((handler) => {
                        return u.partial(handler, this.state.treeNodes || this.props.treeNodes, this);
                    })
                    .value();
            }
            else {
                this._handlers = u.pick(
                    this.props, 'onTreeNodeExpandClicked', 'onTreeNodeRemoveClicked', 'onTreeNodeClicked'
                );
            }
        },

        render: function () {
            var {
                treeNodes,
                isTreeNodesRemovable,
                treeLevel,
                getTreeLevelStyle,
                ...other
            } = this.props;

            if (this.state.treeNodes != null) {
                treeNodes = this.state.treeNodes;
            }

            var nextTreeLevel = treeLevel + 1;

            return (
                <div {...other}
                    data-tree-level={treeLevel}
                    style={getTreeLevelStyle(treeLevel)}
                    className={treeLevel > 0 ? 'fcui2-tree fcui2-tree-inner' : 'fcui2-tree'}
                >
                    {treeNodes.map((node) => {
                        return <div key={node.id}>
                            <Tree.TreeNode {...node} {...this._handlers}
                                isTreeNodesRemovable={isTreeNodesRemovable}
                                treeLevel={treeLevel} />
                                    {node.isExpanded && node.children && node.children.length
                                        ? <Tree {...this.props} {...this._handlers}
                                            treeNodes={node.children}
                                            treeLevel={nextTreeLevel}/>
                                        : ''
                                    }
                        </div>;
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

        getInitialState: function () {
            return {};
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
                onTreeNodeExpandClicked,
                onTreeNodeRemoveClicked,
                onTreeNodeClicked,
                ...other
            } = this.props;

            if (isRemovable == null) {
                isRemovable = isTreeNodesRemovable;
            }

            return (
                <div {...other} className='fcui2-tree-node' onClick={() => {
                    onTreeNodeClicked(this.props);
                }}>
                    <span className={isExpanded ? 'fcui2-tree-node-expanded' : 'fcui2-tree-node-collapsed'}
                        onClick={(e) => {
                            onTreeNodeExpandClicked(this.props);
                            e.stopPropagation();
                        }}
                    ></span>
                    <span className='fcui2-tree-node-name'>{name}</span>
                    {isChildrenLoading
                        ? <span className='fcui2-tree-node-loading'>加载中...</span>
                        : ''
                    }
                    {isRemovable
                        ? <span className='fcui2-tree-node-remove-handle'
                            onClick={(e) => {
                                onTreeNodeRemoveClicked(this.props);
                                e.stopPropagation();
                            }}></span>
                        : ''
                    }
                </div>
            );
        }
    });

    Tree.treeNodeType = treeNode;

    return Tree;
});
