/**
 * @file 列表组件
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.1
 */
define(function (require) {


    var React = require('react');
    var util = require('./core/util');
    var MouseWidgetBase = require('./mixins/MouseWidgetBase');


    return React.createClass({
        // @override
        mixins: [MouseWidgetBase],
        // @override
        getDefaultProps: function () {
            return {
                className: '',
                datasource: [],  // {label: <string>, value: <string>, disable: <boolean>, children: [self]}
                disable: false,
                onClick: function () {}
            };
        },
        // @override
        componentDidMount: function () {
            if (
                this.props.parent
                && this.props.parent.refs.container
                && this.props.parent.refs.container.offsetWidth
            ) {
                this.refs.container.style.minWidth = this.props.parent.refs.container.offsetWidth - 2 + 'px';
            }
        },
        // @override
        getInitialState: function () {
            return {};
        },
        clickHandler: function (e) {
            var dataset = util.getDataset(e.target);
            if (dataset.uiDisable + '' === 'true' || !dataset.uiCmd || this.props.disable) return;
            e.target.value = dataset.uiCmd;
            this.props.onClick(e);
            // 必须stop掉，否则外部如果用了onClick，会触发两次
            e.stopPropagation();
        },
        render: function () {
            var me = this;
            var containerProps = {
                ref: 'container',
                className: 'fcui2-list ' + me.props.className,
                onMouseEnter: this.___mouseenterHandler___,
                onMouseLeave: this.___mouseleaveHandler___,
                onClick: this.clickHandler
            };
            return (<div {...containerProps}>{listFactory(this.props.datasource, '0')}</div>);
        }
    });


    function listFactory(datasource, level) {
        if (datasource.length === 0) return <div></div>;
        var result = [];
        for (var index = 0; index < datasource.length; index++) {
            var treeIndex = level + '-' + index;
            var item = datasource[index];
            var children = item.children instanceof Array ? item.children : [];
            var itemProp = {
                className: 'item' + (item.disable ? ' disable' : ''),
                key: treeIndex,
                'data-ui-disable': item.disable,
                'data-ui-cmd': item.value,
                'data-tree-index': treeIndex
            };
            var spanProp = {
                'data-ui-disable': item.disable,
                'data-ui-cmd': item.value,
                'data-tree-index': treeIndex
            };
            var rightArrowProp = {
                className: 'icon-right font-icon font-icon-largeable-caret-right',
                style: {
                    visibility: children.length > 0 ? 'visible' : 'hidden'
                }
            };
            var rightLayerProp = {
                className: 'layer ' + (children.length > 0 ? 'right-layer' : 'disable-layer')
            };
            result.push(
                <div {...itemProp}>
                    <div {...rightArrowProp}></div>
                    <span {...spanProp}>{item.label}</span>
                    <div {...rightLayerProp}>{listFactory(children, treeIndex)}</div>
                </div>
            );
        }
        return result;
    }
});
