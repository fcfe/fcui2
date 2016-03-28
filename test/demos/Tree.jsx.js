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
                    name: 'Node 1'
                }, {
                    id: '2',
                    name: 'Node 2'
                }]
            }
        }
    ];

    function factory(me, items) {
        let widgets = [];
        function alertEvents(eventType, e, treeNodes, parentTreeNodes) {
            me.props.alert(
                eventType
                + ' | '
                + JSON.stringify(treeNodes)
                + ' | '
                + JSON.stringify(parentTreeNodes)
            )
        }
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
