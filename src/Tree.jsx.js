/**
 * @file 一个树形选择控件。
 * @author Han Bing Feng (hanbingfeng@baidu.com)
 */

define(function (require) {
    var _ = require('underscore');
    var React = require('react');

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
            onTreeNodeRemoveClicked: React.PropTypes.func,
            /**
             * 节点加载中时的话术
             */
            textLoading: React.PropTypes.string
        },

        getDefaultProps: function () {
            return {
                treeLevel: 0,
                isTreeNodesRemovable: true,
                onTreeNodeExpandClicked: _.noop,
                onTreeNodeRemoveClicked: _.noop,
                onTreeNodeClicked: _.noop,
                getTreeLevelStyle: function (level) {
                    return {
                        paddingLeft: (level * 0.5) + 'em'
                    };
                },
                textLoading: '加载中...'
            };
        },

        getInitialState: function () {
            return {
                focusedTreeNode: this.props.focusedTreeNode || {}
            };
        },

        componentWillReceiveProps: function (nextProps) {
            if (this.props.treeLevel > 0 && nextProps.focusedTreeNode != null) {
                this.setState({focusedTreeNode: nextProps.focusedTreeNode});
            }
        },

        componentWillMount: function () {
            if (this.props.treeLevel === 0) {
                this._handlers = _.chain(this.props)
                    .pick('onTreeNodeExpandClicked', 'onTreeNodeRemoveClicked', 'onTreeNodeClicked')
                    .mapObject((handler) => {
                        return _.partial(handler, this.props.treeNodes, this);
                    })
                    .value();
                this._handlers.innerOnTreeNodeClicked = (treeNode) => {
                    this.setState({focusedTreeNode: treeNode});
                }
            }
            else {
                this._handlers = _.pick(
                    this.props,
                    'onTreeNodeExpandClicked', 'onTreeNodeRemoveClicked', 'onTreeNodeClicked', 'innerOnTreeNodeClicked'
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

            var nextTreeLevel = treeLevel + 1;
            var focusedTreeNode = this.state.focusedTreeNode;

            return (
                <div {...other}
                    data-tree-level={treeLevel}
                    style={getTreeLevelStyle(treeLevel)}
                    className={treeLevel > 0 ? 'fcui2-tree fcui2-tree-inner' : 'fcui2-tree'}
                >
                    {treeNodes.map((node) => {
                        return <div key={node.id}>
                            <Tree.TreeNode {...node} {...this._handlers} textLoading={other.textLoading}
                                isTreeNodesRemovable={isTreeNodesRemovable}
                                className={focusedTreeNode.id === node.id ? 'fcui2-tree-node-focused' : ''}
                                treeLevel={treeLevel} />
                                    {node.isExpanded && node.children && node.children.length
                                        ? <Tree {...this.props} {...this.state} {...this._handlers}
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
                isChildrenLoaded: false,
                isRemoved: false
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
                isRemoved,
                isTreeNodesRemovable,
                children,
                parent,
                treeLevel,
                onTreeNodeExpandClicked,
                onTreeNodeRemoveClicked,
                onTreeNodeClicked,
                innerOnTreeNodeClicked,
                textLoading,
                className,
                ...other
            } = this.props;

            if (isRemovable == null) {
                isRemovable = isTreeNodesRemovable;
            }

            className = 'fcui2-tree-node ' + className;

            if (isRemoved) {
                className += ' fcui2-tree-node-removed';
            }

            return (
                <div {...other} className={className} onClick={() => {
                    onTreeNodeClicked(this.props);
                    innerOnTreeNodeClicked(this.props);
                }}>
                    <span className={isExpanded ? 'fcui2-tree-node-expanded' : 'fcui2-tree-node-collapsed'}
                        onClick={(e) => {
                            onTreeNodeExpandClicked(this.props);
                            e.stopPropagation();
                        }}
                    ></span>
                    <span className='fcui2-tree-node-name'>{name}</span>
                    {isChildrenLoading
                        ? <span className='fcui2-tree-node-loading'>{textLoading}</span>
                        : ''
                    }
                    {isRemovable
                        ? <span className='fcui2-tree-node-remove-handle'
                            onClick={(e) => {
                                if (this.props.isRemoved) {
                                    return;
                                }
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
