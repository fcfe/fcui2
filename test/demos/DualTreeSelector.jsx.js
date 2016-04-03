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
        }
    ];

    let _items = [
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
                }]
            }
        },
        {
            title: 'Tree with filter set to "2"',
            props: {
                nameFilter: '2',
                treeNodes: [{
                    id: '1',
                    name: 'Node 1',
                    isChildrenLoaded: true
                }, {
                    id: '2',
                    name: 'Node 2',
                    isChildrenLoaded: true
                }]
            }
        }
    ];

    let asyncState = 'initial';

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
        // the async one
        function asyncOnTreeNodeExpandClicked(e, treeNode, parentTreeNodes) {
            if (treeNode.isChildrenLoaded) {
                alertEvents('expand', e, treeNode, parentTreeNodes);
                return;
            }

            e.preventDefault();

            asyncState = 'loading';

            me.forceUpdate();

            setTimeout(() => {
                asyncState = 'loaded';
                me.forceUpdate();
            }, 1000);
        }
        let _items = items.concat({
            title: 'Tree with children with async loading',
            props: {
                onTreeNodeExpandClicked: asyncOnTreeNodeExpandClicked,
                expandedTreeNodeId: asyncState === 'loaded'
                    ? {
                        1: true
                    }
                    : {},
                treeNodes: [{
                    id: '1',
                    name: 'Node 1 with children with async loading',
                    isChildrenLoaded: asyncState === 'loaded',
                    isChildrenLoading: asyncState === 'loading',
                    children: asyncState === 'loaded'
                        ? [{
                            id: '1.1',
                            name: 'Node 1.1',
                            isChildrenLoaded: true
                        }, {
                            id: '1.2',
                            name: 'Node 1.2',
                            isChildrenLoaded: true
                        }]
                        : []
                }, {
                    id: '2',
                    name: 'Node 2',
                    isChildrenLoaded: true
                }]
            }
        });

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
            prop = _.extend({
                onLeftTreeNodeExpandClicked: _.partial(alertEvents, 'left-expand'),
                onLeftTreeNodeOperationClicked: _.partial(alertEvents, 'left-oper'),
                height: 150
            }, prop);
            prop.onChange = _.partial(onChange, _, _, i);
            prop.ref = 'dualTree_' + i;
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
                demo: 'DualTreeSelector',
                alert() {}
            };
        },
        render() {
            let containerProp = {
                className: 'demo-content',
                style: {
                    display: this.props.demo === 'DualTreeSelector' ? 'block' : 'none'
                }
            };
            return (<div {...containerProp}>{factory(this, items)}</div>);
        }
    });
});
