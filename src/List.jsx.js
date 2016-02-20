define(function (require) {
    var React = require('react');
    var util = require('./core/util.es6');
    var mixins = require('./core/mixins.jsx');
    return React.createClass({
        // @override
        mixins: [mixins.mouseContainer],
        // @override
        getDefaultProps: function () {
            return {
                className: '',
                datasource: [],
                onAction: function () {}
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
            if (this.state.disable || !dataset.uiCmd) return;
            this.props.onAction('ListClick', dataset.uiCmd);
            e.stopPropagation();
        },
        render: function () {
            var me = this;
            var containerProps = {
                ref: 'container',
                className: 'fcui2-list ' + me.props.className,
                onMouseEnter: this.mouseenter,
                onMouseLeave: this.mouseleave
            };
            return (
                <div {...containerProps}>
                    {this.props.datasource.map(produceList)}
                </div>
            );
            function produceList(item, index) {
                var children = item.datasource instanceof Array ? item.datasource : [];
                var itemProp = {
                    onClick: me.clickHandler,
                    className: 'item' + (item.disable ? ' disable' : ''),
                    key: index
                };
                var spanProp = {
                    onClick: me.clickHandler
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
                if (!item.disable) {
                    itemProp['data-ui-cmd'] = spanProp['data-ui-cmd'] = item.value;
                }
                return (
                    <div {...itemProp}>
                        <div {...rightArrowProp}></div>
                        <span {...spanProp}>{item.label}</span>
                        <div {...rightLayerProp}>{children.map(produceList)}</div>
                    </div>
                );
            }
        }
    });
});
