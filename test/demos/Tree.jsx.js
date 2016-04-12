/**
 * @file Tree Demo
 * @author Han Bing Feng (hanbingfeng@)
 */

define(function (require) {
    let React = require('react');
    let Tree = require('fcui/Tree.jsx');
    let _ = require('underscore');

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
                }]
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
                }]
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
        items = items.concat({
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

        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            let prop = item.props;
            prop = _.extend({
                onTreeNodeExpandClicked: _.partial(alertEvents, 'expand'),
                onTreeNodeOperationClicked: _.partial(alertEvents, 'operation'),
                onTreeNodeClicked: _.partial(alertEvents, 'click')
            }, prop);
            let conf = JSON.stringify(prop);
            widgets.push(
                <div className="demo-item" key={i}>
                    <h3>{item.title}</h3>
                    <div className="props">{conf}</div>
                    <Tree {...prop}/>
                </div>
            );
        }
        return widgets;
    }

    return React.createClass({
        mixins: [React.addons.LinkedStateMixin, React.addons.PureRenderMixin],
        // @override
        getDefaultProps() {
            return {
                demo: 'Tree',
                alert() {}
            };
        },
        clickHandler(e) {
            this.props.alert(e.target.value);
        },
        render() {
            let containerProp = {
                className: 'demo-content',
                style: {
                    display: this.props.demo === 'Tree' ? 'block' : 'none'
                }
            };
            return (<div {...containerProp}>{factory(this, items)}</div>);
        }
    });
});
