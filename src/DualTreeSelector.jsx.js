/**
 * 双树选择器
 * @author Han Bing Feng (hanbingfeng@baidu.com)
 * @version 0.0.1
 */
define(function (require) {
    let _ = require('underscore');
    let React = require('react');
    let InputWidget = require('./mixins/InputWidget');
    let Tree = require('./Tree.jsx');
    let treeTools = require('./core/treeTools.es6');

    let DualTreeSelector = React.createClass({
       
         /*propTypes: {
            treeNodes: React.PropTypes.arrayOf(Tree.treeNodeType),
            value: React.PropTypes.objectOf(React.PropTypes.bool),
            leftTreeFilter: React.PropTypes.string,
            leftTreeWidth: React.PropTypes.number,
            rightTreeWidth: React.PropTypes.number,
            height: React.PropTypes.number,
            leftTreeTitle: React.PropTypes.string,
            rightTreeTitle: React.PropTypes.string,
            leftTreeSummary: React.PropTypes.string,
            rightTreeSummary: React.PropTypes.string,
            onChange: React.PropTypes.func,
            onLeftTreeNodeExpand: React.PropTypes.func,
            onLeftTreeNodeOperationClicked: React.PropTypes.func
        },*/

        mixins: [InputWidget],

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

        componentDidMount() {
            console.warn('Warning: Please use DualTreeSelector-test.jsx instead.');
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

        setLeftTreeExpandedTreeNodeId(expandedTreeNodeId) {
            this.refs.leftTree.setState({expandedTreeNodeId});
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
