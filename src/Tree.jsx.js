/**
 * @file 一个树形选择控件。
 * @author Han Bing Feng (hanbingfeng@baidu.com)
 */

define(function (require) {
    var _ = require('underscore');
    var React = require('react');
    var util = require('./core/util.es6');

    /**
     * 一个树节点的定义
     */
    var treeNode = React.PropTypes.shape({
        /**
         * 树节点id
         */
        id: React.PropTypes.string,
        /**
         * 树节点文本内容
         */
        name: React.PropTypes.string,
        /**
         * 树节点的 载入中 状态
         */
        isChildrenLoading: React.PropTypes.bool,
        /**
         * 树节点的 已载入 状态
         */
        isChildrenLoaded: React.PropTypes.bool,
        /**
         * 所有孩子
         */
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
             * 根据节点的层数，计算当前层的wrapper的style
             * @param {number} level 树的层数
             * @return {Object} 当前层的style object
             */
            getTreeLevelStyle: React.PropTypes.func,
            /**
             * 节点展开按钮被点击时的回调。
             * @param {treeNode} node 当前被展开的treeNode
             * @param {bool} 当前点击是要展开节点(true)，或是关闭节点
             * @return {bool} 返回true则阻止默认的行为
             */
            onTreeNodeExpandClicked: React.PropTypes.func,
            /**
             * 节点操作按钮被点击时的回调
             * @param node 当前被操作的treeNode
             */
            onTreeNodeOperationClicked: React.PropTypes.func,
            /**
             * 节点本身被点击时的回调。
             * @param node 当前被操作的treeNode
             * @return {bool} 返回true则阻止默认的行为
             */
            onTreeNodeClicked: React.PropTypes.func,
            /**
             * 节点加载中时的话术
             */
            textLoading: React.PropTypes.string,
            /**
             * 需要高亮显示的节点
             */
            focusedTreeNodeId: React.PropTypes.string,
            /**
             * filter string，不显示name中含有nameFilterString的node
             */
            nameFilter: React.PropTypes.string,
            /**
             * 被展开的节点集合
             */
            expandedTreeNodeId: React.PropTypes.objectOf(React.PropTypes.bool),
            /**
             * 被标记的节点集合
             */
            markedTreeNodeId: React.PropTypes.objectOf(React.PropTypes.bool)
        },

        getDefaultProps: function () {
            return {
                treeLevel: 0,
                onTreeNodeExpandClicked: _.noop,
                onTreeNodeOperationClicked: _.noop,
                onTreeNodeClicked: _.noop,
                getTreeLevelStyle: function (level) {
                    return {
                        paddingLeft: (level * 0.5) + 'em'
                    };
                },
                markedTreeNodeId: {},
                textLoading: '加载中...',
                nameFilter: null
            };
        },

        getInitialState: function () {
            return {
                focusedTreeNodeId: this.props.focusedTreeNodeId || '',
                expandedTreeNodeId: this.props.expandedTreeNodeId || {},
                markedTreeNodeId: this.props.markedTreeNodeId || {}
            };
        },

        componentWillReceiveProps: function (nextProps) {
            this.setState(_.pick(nextProps, 'focusedTreeNodeId', 'expandedTreeNodeId', 'markedTreeNodeId'));
        },

        componentWillMount: function () {
            this._handlers = {};
            if (this.props.treeLevel === 0) {
                this._handlers.onTreeNodeExpandClicked = util.chainFunctions(
                    this.props.onTreeNodeExpandClicked,
                    function (treeNode) {
                        var expandedTreeNodeId = null;
                        if (this.state.expandedTreeNodeId[treeNode.id]) {
                            expandedTreeNodeId = _.omit(this.state.expandedTreeNodeId, treeNode.id);
                        }
                        else {
                            expandedTreeNodeId = _.extend({}, this.state.expandedTreeNodeId);
                            expandedTreeNodeId[treeNode.id] = true;
                        }
                        this.setState({
                            expandedTreeNodeId: expandedTreeNodeId
                        });
                    }.bind(this)
                );
                this._handlers.onTreeNodeClicked = util.chainFunctions(
                    this.props.onTreeNodeClicked,
                    function (treeNode) {
                        this.setState({focusedTreeNodeId: treeNode.id});
                    }.bind(this)
                );
                this._handlers.onTreeNodeOperationClicked = this.props.onTreeNodeOperationClicked;
            }
            else {
                this._handlers = _.pick(
                    this.props,
                    'onTreeNodeExpandClicked', 'onTreeNodeOperationClicked', 'onTreeNodeClicked'
                );
            }
        },

        render: function () {
            var {
                treeLevel,
                getTreeLevelStyle,
                style,
                textLoading,
                className = '',
                ...other
            } = this.props;

            var nextTreeLevel = treeLevel + 1;
            style = _.extend({}, getTreeLevelStyle(treeLevel), style);
            var treeNodeProps = _.extend(
                _.pick(this.props, 'textLoading', 'treeLevel', 'nameFilter'),
                this._handlers
            );
            var innerTreeProps = _.extend(
                _.omit(this.props, 'className', 'style'),
                _.pick(this.state, 'focusedTreeNodeId', 'expandedTreeNodeId'),
                this._handlers
            );

            var treeNodesComponents = this.props.treeNodes.map((node) => {
                var isExpanded = !!this.state.expandedTreeNodeId[node.id];
                var isMarked = !!this.state.markedTreeNodeId[node.id];
                return <div key={node.id}>
                    <Tree.TreeNode {...treeNodeProps} treeNode={node} isExpanded={isExpanded}
                        className={[
                            this.state.focusedTreeNodeId === node.id ? 'fcui2-tree-node-focused' : '',
                            isMarked ? 'fcui2-tree-node-marked' : ''
                        ].join(' ')}
                    />
                    {isExpanded
                        && node.children
                        && node.children.length
                        ? <Tree {...innerTreeProps} treeNodes={node.children} treeLevel={nextTreeLevel} />
                        : ''
                    }
                </div>;
            });


            return (
                <div {...other}
                    data-tree-level={treeLevel}
                    style={style}
                    className={[
                        className,
                        treeLevel > 0 ? 'fcui2-tree fcui2-tree-inner' : 'fcui2-tree'
                    ].join(' ')}
                >
                    {treeNodesComponents}
                </div>
            );
        }
    });

    Tree.TreeNode = React.createClass({
        propTypes: {
            treeNode: treeNode,
            nameFilter: React.PropTypes.string,
            isExpanded: React.PropTypes.bool,
            onTreeNodeExpandClicked: React.PropTypes.func,
            onTreeNodeOperationClicked: React.PropTypes.func,
            onTreeNodeClicked: React.PropTypes.func,
            textLoading: React.PropTypes.string,
            className: React.PropTypes.string
        },

        render: function () {
            var {
                treeNode,
                nameFilter,
                isExpanded,
                onTreeNodeExpandClicked,
                onTreeNodeOperationClicked,
                onTreeNodeClicked,
                textLoading,
                className,
                ...other
            } = this.props;

            className = [
                'fcui2-tree-node',
                className
            ];

            if (treeNode.isChildrenLoaded && (treeNode.children == null || treeNode.children.length === 0)) {
                className.push('fcui2-tree-node-leaf');
            }

            if (nameFilter != null && treeNode.name.indexOf(nameFilter) === -1) {
                className.push('fcui2-tree-node-filtered');
            }

            return (
                <div {...other} className={className.join(' ')} onClick={() => {
                    onTreeNodeClicked.call(this, treeNode);
                }}>
                    <span className={isExpanded ? 'fcui2-tree-node-expanded' : 'fcui2-tree-node-collapsed'}
                        onClick={(e) => {
                            onTreeNodeExpandClicked.call(this, treeNode, !isExpanded);
                            e.stopPropagation();
                        }}
                    ></span>
                    <span className='fcui2-tree-node-name'>{treeNode.name}</span>
                    {treeNode.isChildrenLoading
                        ? <span className='fcui2-tree-node-loading'>{textLoading}</span>
                        : ''
                    }
                    <span className='fcui2-tree-node-oper-handle'
                        onClick={(e) => {
                            if (treeNode.isRemoved) {
                                return;
                            }
                            onTreeNodeOperationClicked.call(this, treeNode);
                            e.stopPropagation();
                        }}>
                    </span>
                </div>
            );
        }
    });

    Tree.treeNodeType = treeNode;

    return Tree;
});
