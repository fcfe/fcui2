/**
 * @file Tree Demo
 * @author Han Bing Feng (hanbingfeng@)
 */

define(function (require) {
    let React = require('react');
    let _ = require('underscore');
    let DualTreeSelector = require('fcui/DualTreeSelector.jsx');
    let treeTools = require('fcui/core/treeTools.es6');

    let items = [
        {
            title: 'Normal Tree',
            props: {
                treeNodes: [{
                    id: '1',
                    name: 'Node 1',
                    isChildrenLoaded: true
                }, {
                    id: '2',
                    name: 'Node 2',
                    isChildrenLoaded: true
                }],
                value: {}
            }
        },
        {
            title: 'Normal Tree with preset values',
            props: {
                treeNodes: [{
                    id: '1',
                    name: 'Node 1',
                    isChildrenLoaded: true
                }, {
                    id: '2',
                    name: 'Node 2',
                    isChildrenLoaded: true
                }],
                value: {
                    '1': true
                }
            }
        },
        {
            title: 'Tree with children',
            props: {
                treeNodes: [{
                    id: '1',
                    name: 'Node 1 with children',
                    isChildrenLoaded: true,
                    children: [{
                        id: '1.1',
                        name: 'Node 1.1',
                        isChildrenLoaded: true
                    }, {
                        id: '1.2',
                        name: 'Node 1.2',
                        isChildrenLoaded: true
                    }]
                }, {
                    id: '2',
                    name: 'Node 2',
                    isChildrenLoaded: true
                }],
                value: {}
            }
        },
        {
            title: '3-level Tree with children',
            props: {
                treeNodes: [{
                    id: '1',
                    name: 'Node 1 with children',
                    isChildrenLoaded: true,
                    children: [{
                        id: '1.1',
                        name: 'Node 1.1 with children',
                        isChildrenLoaded: true,
                        children: [{
                            id: '1.1.1',
                            name: 'Node 1.1.1',
                            isChildrenLoaded: true                                
                        }]
                    }, {
                        id: '1.2',
                        name: 'Node 1.2',
                        isChildrenLoaded: true
                    }]
                }, {
                    id: '2',
                    name: 'Node 2',
                    isChildrenLoaded: true
                }],
                value: {}
            }
        },
        {
            title: 'Normal tree with async loading',
            props: {
                treeNodes: [{
                    id: '1',
                    name: 'Node 1 with async loading',
                    isChildrenLoaded: false
                }, {
                    id: '2',
                    name: 'Node 2',
                    isChildrenLoaded: true
                }],
                value: {}
            }
        }
    ];

    function factory(me, items) {
        let widgets = [];
        let omitChildren = _.partial(
            _.omit, _, 'children'
        );
        function alertEvents(eventType, e, treeNode, parentTreeNodes) {
            me.props.alert(
                eventType
                + ' | '
                + JSON.stringify(omitChildren(treeNode))
                + ' | '
                + JSON.stringify(parentTreeNodes.map(omitChildren))
            );
        }

        function asyncLoad(cb) {
            let node = items[3].props.treeNodes[0];
            node.isChildrenLoading = true;

            me.forceUpdate();

            setTimeout(() => {
                node.isChildrenLoaded = true;
                node.isChildrenLoading = false;
                node.children = [{
                    id: '1.1',
                    name: 'Node 1.1',
                    isChildrenLoaded: true
                }, {
                    id: '1.2',
                    name: 'Node 1.2',
                    isChildrenLoaded: true
                }];
                let theComponent = me.refs['dualTree_3'];
                theComponent.setLeftTreeExpandedTreeNodeId(
                    _.extend({1: true}, theComponent.refs.leftTree.state.expandedTreeId)
                );
                cb && cb(node);
                me.forceUpdate();
            }, 1000);

            return node;
        }

        // the async one
        function asyncOnTreeNodeExpandClicked(e, treeNode, parentTreeNodes) {
            if (treeNode.isChildrenLoaded) {
                alertEvents('expand', e, treeNode, parentTreeNodes);
                return;
            }

            e.preventDefault();

            asyncLoad();
        }

        function asyncOnTreeNodeOperationClicked(e, treeNode, parentTreeNodes) {
            if (treeNode.isChildrenLoaded) {
                alertEvents('expand', e, treeNode, parentTreeNodes);
                return;
            }

            e.preventDefault();

            asyncLoad(node => {
                onChange(null, treeTools.selectTreeNode(node, parentTreeNodes, items[3].props.value), 3);
            });

            me.forceUpdate();
        }

        function onChange(e, value, index) {
            let props = items[index].props;
            let theComponent = me.refs['dualTree_' + index];
            let expandedTreeNodeId = treeTools.getExpandedTreeNodeIdAfterSelect(theComponent, props.value, value);
            theComponent.setRightTreeExpandedTreeNodeId(expandedTreeNodeId);
            props.rightTreeSummary = treeTools.countSelectedLeaf(props.treeNodes, value) + '';
            props.value = value;
            me.props.alert('onChange' + ' | ' + JSON.stringify(value));
            me.forceUpdate();
        }

        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            let prop = item.props;
            if (i === 3) {
                // async
                prop.onLeftTreeNodeExpandClicked = asyncOnTreeNodeExpandClicked;
                prop.onLeftTreeNodeOperationClicked = asyncOnTreeNodeOperationClicked;
                prop.onChange = _.partial(onChange, _, _, i);
            }
            else {
                prop = _.extend({
                    onLeftTreeNodeExpandClicked: _.partial(alertEvents, 'left-expand'),
                    onLeftTreeNodeOperationClicked: _.partial(alertEvents, 'left-oper')
                }, prop);
                prop.onChange = _.partial(onChange, _, _, i);
            }
            prop.ref = 'dualTree_' + i;
            prop.height = 150;
            let conf = JSON.stringify(prop);
            widgets.push(
                <div className="demo-item" key={i}>
                    <h3>{item.title}</h3>
                    <div className="props">{conf}</div>
                    <DualTreeSelector {...prop}/>
                </div>
            );
        }
        return widgets;
    }

    return React.createClass({
        // @override
        getDefaultProps() {
            return {
                alert() {}
            };
        },
        render() {
            return (<div>{factory(this, items)}</div>);
        }
    });
});
