/**
 * @file 一个树形选择控件。
 * @author Han Bing Feng (hanbingfeng@baidu.com)
 */

define(function (require) {
    let _ = require('underscore');
    let React = require('react');

    /**
     * 一个树节点的定义
     */
    let treeNodeType = React.PropTypes.shape({
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
        children: React.PropTypes.array
    });

    /**
     * 默认的树单个节点的Renderer。
     *
     * @param {Object} props the props
     * @param {treeNodeType} props.treeNode 节点数据
     * @param {Array<treeNodeType>} props.parentTreeNodes 当前节点的父节点表
     * @param {boolean} props.isExpanded 节点是否展开
     * @param {string} props.className 树根节点的class name
     *
     * @param {Function} props.afterTreeNodeRenderer 生成可插入节点正文后的元素
     * @param {Function} props.afterTreeNodeRendererProps 属性
     *
     * @param {Function} props.onTreeNodeExpandClicked 树节点展开按钮被点击时的回调
     * @param {SyntheticEvent} props.onTreeNodeExpandClicked.e 点击事件对象
     * @param {treeNodeType} props.onTreeNodeExpandClicked.treeNode 被展开的树节点数据
     *
     * @param {Function} props.onTreeNodeOperationClicked 树节点“操作”按钮被点击时的回调。
     * @param {SyntheticEvent} props.onTreeNodeOperationClicked.e 点击事件对象
     * @param {treeNodeType} props.onTreeNodeOperationClicked.treeNode 被操作的树节点数据
     *
     * @param {Function} props.onTreeNodeClicked 树节点其他位置被点击时的回调。
     * @param {SyntheticEvent} props.onTreeNodeClicked.e 点击事件对象
     * @param {treeNodeType} props.onTreeNodeClicked.treeNode 被点击的树节点数据
     *
     * @return {ReactElement} rendered react element
     */
    function baseTreeNodeRenderer(props) {
        let {
            treeNode,
            isExpanded,
            className = '',
            onTreeNodeExpandClicked = _.noop,
            onTreeNodeOperationClicked = _.noop,
            onTreeNodeClicked = _.noop,
            ...others
        } = props;

        className = [
            'fcui2-tree-node',
            className
        ];

        if (treeNode.isChildrenLoaded && (treeNode.children == null || treeNode.children.length === 0)) {
            className.push('fcui2-tree-node-leaf');
        }

        let AfterTreeNode = props.afterTreeNodeRenderer;

        return (
            <div
                {...others}
                className={className.join(' ')}
                onClick={_.partial(props.onTreeNodeClicked, _, props.treeNode)}
            >
                <span
                    className={isExpanded ? 'fcui2-tree-node-expanded' : 'fcui2-tree-node-collapsed'}
                    onClick={_.partial(props.onTreeNodeExpandClicked, _, props.treeNode)}
                />
                <span className='fcui2-tree-node-name'>{treeNode.name}</span>
                {
                    typeof AfterTreeNode === 'function'
                        ? <AfterTreeNode
                            {...props.afterTreeNodeRendererProps}
                            {...props}
                          />
                        : ''
                }
                <span
                    className='fcui2-tree-node-oper-handle'
                    onClick={_.partial(props.onTreeNodeOperationClicked, _, props.treeNode)}
                />
            </div>
        );
    }

    /**
     * 扩展TreeNodeRenderer，支持绘制树节点的loading状态
     *
     * @param  {Function} TreeNodeRenderer 被扩展的Renderer
     * @return {Function} 支持绘制树节点的loading状态的Renderer
     */
    function supportLoadingText(TreeNodeRenderer) {

        /**
         * 支持绘制树节点的loading状态的Renderer。
         *
         * @param {Object} props the props
         * @param {string} props.textLoading 树节点载入中时的话术提示。
         * @return {ReactElement} rendered element
         */
        return function (props) {
            function afterTreeNode(afterTreeNodeProps) {
                let WrappedAfterTreeNode = props.afterTreeNodeRenderer;
                let textLoadingElement = props.treeNode.isChildrenLoading
                    ? <span className="fcui2-tree-node-loading">{props.textLoading}</span>
                    : <span></span>;
                if (typeof WrappedAfterTreeNode === 'function') {
                    return (
                        <span>
                            <WrappedAfterTreeNode {...afterTreeNodeProps} />
                            {textLoadingElement}
                        </span>
                    );
                }
                return textLoadingElement;
            }
            return <TreeNodeRenderer {...props} afterTreeNodeRenderer={afterTreeNode} />;
        };
    }

    /**
     * 扩展TreeNodeRenderer，支持根据nameFilter加入filter class。
     *
     * @param  {Function} TreeNodeRenderer 被扩展的Renderer。
     * @return {Function} 支持根据nameFilter加入filter class的Renderer。
     */
    function supportNameFilter(TreeNodeRenderer) {

        /**
         * 支持根据nameFilter加入filter class。
         *
         * @param {Object} props the props
         * @param {string} props.nameFilter 树名字过滤器，不包含过滤器中字符串的节点将加上class`fcui2-tree-node-filtered`。
         * @return {ReactElement} rendered element
         */
        return function (props) {
            let {
                nameFilter,
                className = ''
            } = props;

            if (nameFilter != null && props.treeNode.name.indexOf(nameFilter) === -1) {
                className = className + ' fcui2-tree-node-filtered';
            }

            return <TreeNodeRenderer {...props} className={className} />;
        };
    }

    let Tree = React.createClass({
        propTypes: {
            /**
             * 树所展现的所有节点集合
             */
            treeNodes: React.PropTypes.arrayOf(treeNodeType),
            /**
             * 本层次树的上层节点
             */
            parentTreeNodes: React.PropTypes.arrayOf(treeNodeType),
            /**
             * 根据节点的层数，计算当前层的wrapper的style
             * @param {number} level 树的层数
             * @return {Object} 当前层的style object
             */
            getTreeLevelStyle: React.PropTypes.func,
            /**
             * 树节点展开按钮被点击时的回调。
             * @param {SyntheticEvent} onTreeNodeExpandClicked.e 点击事件对象
             * @param {treeNodeType} onTreeNodeExpandClicked.treeNode 被展开的树节点数据
             * @param {Array<treeNodeType>} onTreeNodeExpandClicked.parentTreeNodes 当前节点的父节点列表
             */
            onTreeNodeExpandClicked: React.PropTypes.func,
            /**
             * 树节点“操作”按钮被点击时的回调。
             * @param {SyntheticEvent} onTreeNodeOperationClicked.e 点击事件对象
             * @param {treeNodeType} onTreeNodeOperationClicked.treeNode 被操作的树节点数据
             * @param {Array<treeNodeType>} onTreeNodeOperationClicked.parentTreeNodes 当前节点的父节点列表
             */
            onTreeNodeOperationClicked: React.PropTypes.func,
            /**
             * 树节点其他位置被点击时的回调。
             * @param {SyntheticEvent} onTreeNodeClicked.e 点击事件对象
             * @param {treeNodeType} onTreeNodeClicked.treeNode 被操作的树节点数据
             * @param {Array<treeNodeType>} onTreeNodeClicked.parentTreeNodes 当前节点的父节点列表
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

        statics: {
            treeNodeType,
            baseTreeNodeRenderer,
            supportLoadingText,
            supportNameFilter
        },

        getDefaultProps() {
            return {
                treeLevel: 0,
                onTreeNodeExpandClicked: _.noop,
                onTreeNodeOperationClicked: _.noop,
                onTreeNodeClicked: _.noop,
                markedTreeNodeId: {},
                textLoading: '加载中...',
                nameFilter: null,
                parentTreeNodes: [],
                treeNodes: [],
                treeNodeRenderer: supportLoadingText(supportNameFilter(baseTreeNodeRenderer)),
                getTreeLevelStyle(level) {
                    return {
                        paddingLeft: (level * 0.5) + 'em'
                    };
                }
            };
        },

        getInitialState() {
            return {
                focusedTreeNodeId: this.props.focusedTreeNodeId || '',
                expandedTreeNodeId: this.props.expandedTreeNodeId || {},
                markedTreeNodeId: this.props.markedTreeNodeId || {}
            };
        },

        componentWillReceiveProps(nextProps) {
            this.setState(_.pick(nextProps, 'focusedTreeNodeId', 'expandedTreeNodeId', 'markedTreeNodeId'));
        },

        onTreeNodeExpandClicked(e, treeNode, parentTreeNodes) {
            this.props.onTreeNodeExpandClicked(
                e,
                treeNode,
                _.isArray(parentTreeNodes) ? parentTreeNodes : this.props.parentTreeNodes
            );

            if (this.props.parentTreeNodes.length) {
                return;
            }

            if (e.isDefaultPrevented()) {
                return;
            }

            e.stopPropagation();

            let expandedTreeNodeId;

            if (this.state.expandedTreeNodeId[treeNode.id]) {
                expandedTreeNodeId = _.omit(this.state.expandedTreeNodeId, treeNode.id);
            }
            else {
                expandedTreeNodeId = _.extend({}, this.state.expandedTreeNodeId);
                expandedTreeNodeId[treeNode.id] = true;
            }
            this.setState({
                expandedTreeNodeId
            });
        },

        onTreeNodeClicked(e, treeNode, parentTreeNodes) {
            this.props.onTreeNodeClicked(
                e,
                treeNode,
                _.isArray(parentTreeNodes) ? parentTreeNodes : this.props.parentTreeNodes
            );

            if (this.props.parentTreeNodes.length) {
                return;
            }

            if (e.isDefaultPrevented()) {
                return;
            }

            this.setState({
                focusedTreeNodeId: treeNode.id
            });
        },

        onTreeNodeOperationClicked(e, treeNode, parentTreeNodes) {
            this.props.onTreeNodeOperationClicked(
                e,
                treeNode,
                _.isArray(parentTreeNodes) ? parentTreeNodes : this.props.parentTreeNodes
            );

            e.stopPropagation();
        },

        getHandlers() {
            return {
                onTreeNodeExpandClicked: this.onTreeNodeExpandClicked,
                onTreeNodeClicked: this.onTreeNodeClicked,
                onTreeNodeOperationClicked: this.onTreeNodeOperationClicked
            };
        },

        getTreeNodeProps() {
            return _.extend(
                _.pick(this.props, 'textLoading', 'treeLevel', 'nameFilter', 'parentTreeNodes'),
                this.getHandlers()
            );
        },

        getInnerTreeProps() {
            return _.extend(
                _.omit(this.props, 'className', 'style'),
                _.pick(this.state, 'focusedTreeNodeId', 'expandedTreeNodeId'),
                this.getHandlers()
            );
        },

        getTreeNode(treeNode) {
            let isExpanded = !!this.state.expandedTreeNodeId[treeNode.id];
            let isMarked = !!this.state.markedTreeNodeId[treeNode.id];
            let TreeNode = this.props.treeNodeRenderer;
            return (
                <div key={treeNode.id}>
                    <TreeNode
                        {...this.getTreeNodeProps()}
                        treeNode={treeNode}
                        isExpanded={isExpanded}
                        className={[
                            this.state.focusedTreeNodeId === treeNode.id ? 'fcui2-tree-node-focused' : '',
                            isMarked ? 'fcui2-tree-node-marked' : ''
                        ].join(' ')}
                    />
                    {
                        isExpanded && treeNode.children && treeNode.children.length
                            ? (
                                <Tree
                                    {...this.getInnerTreeProps()}
                                    parentTreeNodes={this.props.parentTreeNodes.concat(treeNode)}
                                    treeNodes={treeNode.children}
                                 />
                            )
                            : ''
                    }
                </div>
            );
        },

        render() {
            let {
                getTreeLevelStyle,
                style,
                className = '',
                ...other
            } = this.props;

            let treeLevel = this.props.parentTreeNodes.length;

            return (
                <div
                    {...other}
                    data-tree-level={treeLevel}
                    style={_.extend({}, getTreeLevelStyle(treeLevel), style)}
                    className={[
                        className,
                        treeLevel > 0 ? 'fcui2-tree fcui2-tree-inner' : 'fcui2-tree'
                    ].join(' ')}
                >
                    {this.props.treeNodes.map(this.getTreeNode)}
                </div>
            );
        }
    });

    return Tree;
});
