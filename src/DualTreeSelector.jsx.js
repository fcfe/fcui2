/**
 * @file 双树选择器。
 * @author Han Bing Feng (hanbingfeng@baidu.com)
 */

define(function (require) {
    let _ = require('underscore');
    let React = require('react');
    let InputWidgetBase = require('./mixins/InputWidgetBase');
    let InputWidgetInForm = require('./mixins/InputWidgetInForm');
    let Tree = require('./Tree.jsx');
    let treeTools = require('./core/treeTools.es6');

    let DualTreeSelector = React.createClass({
        propTypes: {
            /**
             * 全部可选节点的列表
             */
            treeNodes: React.PropTypes.arrayOf(Tree.treeNodeType),
            /**
             * 已选节点的id集合
             */
            value: React.PropTypes.objectOf(React.PropTypes.bool),
            /**
             * 左树的tree node name filter。
             */
            leftTreeFilter: React.PropTypes.string,
            /**
             * 左子树的宽度，px
             */
            leftTreeWidth: React.PropTypes.number,
            /**
             * 右子树的宽度，px
             */
            rightTreeWidth: React.PropTypes.number,
            /**
             * 选择器中树的高度，px
             */
            height: React.PropTypes.number,
            /**
             * 左树的标题
             */
            leftTreeTitle: React.PropTypes.string,
            /**
             * 右树的标题
             */
            rightTreeTitle: React.PropTypes.string,
            /**
             * 左树左下角的提示话术
             */
            leftTreeSummary: React.PropTypes.string,
            /**
             * 右树右下角的提示话术
             */
            rightTreeSummary: React.PropTypes.string,
            /**
             * 树点击选择按钮后的回调。
             * @param {object} onChange.e 选择后的树节点
             */
            onChange: React.PropTypes.func,
            /**
             * 左树节点展开时的回调
             * @param {SyntheticEvent} onLeftTreeNodeExpand.e 点击事件对象
             * @param {treeNodeType} onLeftTreeNodeExpand.treeNode 被操作的树节点数据
             * @param {Array<treeNodeType>} onLeftTreeNodeExpand.parentTreeNodes 当前节点的父节点列表
             */
            onLeftTreeNodeExpand: React.PropTypes.func,
            /**
             * 左树“操作”按钮点击时的回调
             *
             * @param {SyntheticEvent} e 点击事件对象
             * @param {treeNodeType} treeNode 被操作的树节点数据
             * @param {Array<treeNodeType>} parentTreeNodes 当前节点的父节点列表
             */
            onLeftTreeNodeOperationClicked: React.PropTypes.func
        },

        mixins: [InputWidgetBase, InputWidgetInForm],

        getDefaultProps() {
            return {
                leftTreeWidth: 310,
                rightTreeWidth: 310,
                height: 380,
                leftTreeTitle: '可选项目',
                rightTreeTitle: '已选项目',
                onLeftTreeNodeExpandClicked: _.noop,
                onLeftTreeNodeOperationClicked: _.noop
            };
        },

        /**
         * 左树“操作”按钮点击时的回调
         *
         * @param {SyntheticEvent} e 点击事件对象
         * @param {treeNodeType} treeNode 被操作的树节点数据
         * @param {Array<treeNodeType>} parentTreeNodes 当前节点的父节点列表
         */
        onLeftTreeNodeOperationClicked(e, treeNode, parentTreeNodes) {
            this.props.onLeftTreeNodeOperationClicked(e, treeNode, parentTreeNodes);
            if (e.isDefaultPrevented()) {
                return;
            }
            this.___dispatchChange___(e, treeTools.selectTreeNode(treeNode, parentTreeNodes, this.___getValue___()));
        },

        /**
         * 左树“展开”按钮点击时的回调
         *
         * @param {SyntheticEvent} e 点击事件对象
         * @param {treeNodeType} treeNode 被操作的树节点数据
         * @param {Array<treeNodeType>} parentTreeNodes 当前节点的父节点列表
         */
        onLeftTreeNodeExpandClicked(e, treeNode, parentTreeNodes) {
            this.props.onLeftTreeNodeExpandClicked(e, treeNode, parentTreeNodes);
        },

        /**
         * 右树“操作”按钮点击时的回调
         *
         * @param {SyntheticEvent} e 点击事件对象
         * @param {treeNodeType} treeNode 被操作的树节点数据
         * @param {Array<treeNodeType>} parentTreeNodes 当前节点的父节点列表
         */
        onRightTreeNodeOperationClicked(e, treeNode, parentTreeNodes) {
            this.___dispatchChange___(e, treeTools.unselectTreeNode(treeNode, parentTreeNodes, this.___getValue___()));
        },

        /**
         * 全部删除时的回调
         *
         * @param {SyntheticEvent} e 点击事件对象
         */
        onRemoveAll(e) {
            this.___dispatchChange___(e, {});
        },

        setRightTreeExpandedTreeNodeId(expandedTreeNodeId) {
            this.refs.rightTree.setState({expandedTreeNodeId});
        },

        render() {
            return (
                <div className='fcui2-dual-tree-selector'>
                    <div className='fcui2-dual-tree-selector-left-tree-wrapper'>
                        <div className="fcui2-dual-tree-selector-tree-title">{this.props.leftTreeTitle}</div>
                        <Tree
                            style={{width: this.props.leftTreeWidth, height: this.props.height}}
                            nameFilter={this.props.leftTreeFilter}
                            treeNodes={this.props.treeNodes}
                            markedTreeNodeId={this.___getValue___()}
                            onTreeNodeOperationClicked={this.onLeftTreeNodeOperationClicked}
                            onTreeNodeExpandClicked={this.onLeftTreeNodeExpandClicked}
                            ref='leftTree'
                        />
                        <div className='fcui2-dual-tree-selector-tree-footer'>
                            <span className='fcui2-dual-tree-selector-tree-footer-summary'>
                                {this.props.leftTreeSummary}
                            </span>
                        </div>
                    </div>
                    <div
                        className='fcui2-dual-tree-selector-separator'
                        style={{lineHeight: this.props.height + 'px'}}
                    />
                    <div className='fcui2-dual-tree-selector-right-tree-wrapper'>
                        <div className='fcui2-dual-tree-selector-tree-title'>
                            {this.props.rightTreeTitle}
                        </div>
                        <Tree
                            style={{width: this.props.rightTreeWidth, height: this.props.height}}
                            treeNodes={treeTools.getSelectedTree(this.props.treeNodes, this.___getValue___())}
                            onTreeNodeOperationClicked={this.onRightTreeNodeOperationClicked}
                            ref='rightTree'
                        />
                        <div className='fcui2-dual-tree-selector-tree-footer'>
                            <span className='fcui2-dual-tree-selector-tree-footer-summary'>
                                {this.props.rightTreeSummary}
                            </span>
                            <span className='fcui2-dual-tree-selector-tree-footer-remove-all'>
                                <a href='javascript:;' onClick={this.onRemoveAll}>全部删除</a>
                            </span>
                        </div>
                    </div>
                    <div style={{clear: 'both'}} />
                </div>
            );
        }
    });

    return DualTreeSelector;
});
