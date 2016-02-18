/**
 * @file 一个树形选择控件。
 * @author Han Bing Feng (hanbingfeng@baidu.com)
 */

define(function (require) {
    var _ = require('underscore');
    var React = require('react');
    var util = require('./core/util.es6');
    var treeUtil = require('./core/treeUtil.es6');

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
             * 节点展开按钮被点击时的回调。
             * @param node 当前被展开的treeNode
             * @param treeNodes 全体treeNode
             * @return {bool} 返回true则阻止默认的行为
             */
            onTreeNodeExpandClicked: React.PropTypes.func,
            /**
             * 节点删除按钮被点击时的回调。
             * @param node 当前被删除的treeNode
             * @param treeNodes 全体treeNode
             * @return {bool} 返回true则阻止默认的行为
             */
            onTreeNodeRemoveClicked: React.PropTypes.func,
            /**
             * 节点本身被点击时的回调。
             * @return {bool} 返回true则阻止默认的行为
             */
            onTreeNodeClicked: React.PropTypes.func,
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
            var initialState = {focusedTreeNode: this.props.focusedTreeNode || {}};
            if (this.props.treeLevel === 0) {
                var freezer = treeUtil.getFrozenTreeNodes(this.props.treeNodes);
                util.bindFreezerAndComponent(freezer.treeNodesFreezer, this, 'treeNodes');
                _.extend(initialState, freezer);
            }
            else {
                initialState.treeNodes = this.props.treeNodes;
            }
            return initialState;
        },

        componentWillReceiveProps: function (nextProps) {
            if (nextProps.focusedTreeNode != null && nextProps.focusedTreeNode !== this.state.focusedTreeNode) {
                this.setState({focusedTreeNode: nextProps.focusedTreeNode});
            }
            if (nextProps.treeNodes != null && nextProps.treeNodes !== this.state.treeNodes) {
                if (this.props.treeLevel === 0) {
                    var freezer = treeUtil.getFrozenTreeNodes(this.props.treeNodes);
                    util.bindFreezerAndComponent(freezer.treeNodesFreezer, this, 'treeNodes');
                    this.setState(freezer);
                }
                else {
                    this.setState('treeNodes', this.props.treeNodes);
                }
            }
        },

        componentWillMount: function () {
            this._handlers = {};
            if (this.props.treeLevel === 0) {
                this._handlers.onTreeNodeExpandClicked = util.chainFunctions(
                    this.props.onTreeNodeExpandClicked,
                    (treeNode) => {
                        treeNode.set('isExpanded', true);
                    }
                );
                this._handlers.onTreeNodeClicked = util.chainFunctions(
                    this.props.onTreeNodeClicked,
                    (treeNode) => {
                        this.setState({focusedTreeNode: treeNode});
                    }
                );
                this._handlers.onTreeNodeRemoveClicked = this.props.onTreeNodeRemoveClicked;
            }
            else {
                this._handlers = _.pick(
                    this.props,
                    'onTreeNodeExpandClicked', 'onTreeNodeRemoveClicked', 'onTreeNodeClicked'
                );
            }
        },

        render: function () {
            var {
                isTreeNodesRemovable,
                treeLevel,
                getTreeLevelStyle,
                style,
                textLoading,
                className = '',
                ...other
            } = this.props;
            var {
                focusedTreeNode,
                treeNodes
            } = this.state;

            var nextTreeLevel = treeLevel + 1;
            style = _.extend({}, getTreeLevelStyle(treeLevel), style);
            var treeNodeProps = _.extend(
                _.pick(this.props, 'textLoading', 'isTreeNodesRemovable', 'treeLevel'),
                this._handlers
            );
            var innerTreeProps = _.extend(
                _.omit(this.props, 'className', 'style'),
                _.pick(this.state, 'focusedTreeNode'),
                this._handlers
            );

            return (
                <div {...other}
                    data-tree-level={treeLevel}
                    style={style}
                    className={[
                        className,
                        treeLevel > 0 ? 'fcui2-tree fcui2-tree-inner' : 'fcui2-tree'
                    ].join(' ')}
                >
                    {treeNodes.map((node) => {
                        return <div key={node.id}>
                            <Tree.TreeNode {...treeNodeProps} treeNode={node}
                                className={[
                                    focusedTreeNode === node ? 'fcui2-tree-node-focused' : ''
                                ].join(' ')}
                            />
                                {node.isExpanded && node.children && node.children.length
                                    ? <Tree {...innerTreeProps} treeNodes={node.children} treeLevel={nextTreeLevel} />
                                    : ''
                                }
                        </div>;
                    })}
                </div>
            );
        }
    });

    Tree.TreeNode = React.createClass({
        propTypes: {
            treeNode: treeNode,
            onTreeNodeExpandClicked: React.PropTypes.func,
            onTreeNodeRemoveClicked: React.PropTypes.func,
            onTreeNodeClicked: React.PropTypes.func,
            isTreeNodesRemovable: React.PropTypes.bool,
            textLoading: React.PropTypes.string,
            className: React.PropTypes.string
        },

        render: function () {
            var {
                treeNode,
                isTreeNodesRemovable,
                onTreeNodeExpandClicked,
                onTreeNodeRemoveClicked,
                onTreeNodeClicked,
                textLoading,
                className,
                ...other
            } = this.props;

            var isRemovable = treeNode.isRemovable == null ? isTreeNodesRemovable : treeNode.isRemovable;

            className = [
                'fcui2-tree-node',
                treeNode.isRemoved ? 'fcui2-tree-node-removed' : '',
                className
            ].join(' ');

            return (
                <div {...other} className={className} onClick={() => {
                    onTreeNodeClicked.call(this, treeNode);
                }}>
                    <span className={treeNode.isExpanded ? 'fcui2-tree-node-expanded' : 'fcui2-tree-node-collapsed'}
                        onClick={(e) => {
                            onTreeNodeExpandClicked.call(this, treeNode);
                            e.stopPropagation();
                        }}
                    ></span>
                    <span className='fcui2-tree-node-name'>{treeNode.name}</span>
                    {treeNode.isChildrenLoading
                        ? <span className='fcui2-tree-node-loading'>{textLoading}</span>
                        : ''
                    }
                    {isRemovable
                        ? <span className='fcui2-tree-node-remove-handle'
                            onClick={(e) => {
                                if (treeNode.isRemoved) {
                                    return;
                                }
                                onTreeNodeRemoveClicked.call(this, treeNode);
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
