define(function (require) {

    var util = require('./core/util');
    var React = require('react');

    return React.createClass({
        // @override
        getDefaultProps: function () {
            return {
                label: 'DropDownList',
                minWidth: 60,
                disable: false,
                datasource: [],         // {label: <string>, cmd: <string>, disable: <boolean>}
                onClick: function () {}
            };
        },
        // @override
        componentWillReceiveProps: function (props) {
            this.setState({
                disable: props.disable,
                datasource: JSON.parse(JSON.stringify(props.datasource))
            });
        },
        // @override
        getInitialState: function () {
            return {
                disable: this.props.disable,
                datasource: JSON.parse(JSON.stringify(this.props.datasource)),
                layerPosition: 'bottom-layer'
            };
        },
        clickHandler: function (e) {
            var dataset = util.getDataset(e.target);
            if (this.state.disable || !dataset.uiCmd) return;
            this.props.onClick({
                target: this,
                value: dataset.uiCmd
            });
            e.stopPropagation();
        },
        fixedLayerPosition: function () {
            util.fixedLayerPositionTB(this.refs.container, this.refs.layer, this);
        },
        render: function () {
            var me = this;
            var containerProp = {
                className: 'fcui2-dropdownlist' + (this.state.disable ? ' fcui2-dropdownlist-disable' : ''),
                style: {minWidth: this.props.minWidth},
                onClick: this.clickHandler,
                onMouseEnter: this.fixedLayerPosition,
                ref: 'container'
            };
            var layerProp = {
                className: 'layer ' + this.state.layerPosition,
                ref: 'layer'
            };
            return (
                <div {...containerProp}>
                    <div className="icon-right font-icon font-icon-largeable-caret-down"></div>
                    <span>{this.props.label}</span>
                    <div {...layerProp}>{this.state.datasource.map(produceItem)}</div>
                </div>
            );
            function produceItem(item, index) {
                var children = item.datasource instanceof Array ? item.datasource : [];
                var itemProp = {
                    onClick: me.clickHandler,
                    className: 'item' + (me.state.disable || item.disable ? ' disable' : ''),
                    key: index
                };
                var spanProp = {onClick: me.clickHandler};
                var rightArrowProp = {
                    className: 'icon-right font-icon font-icon-largeable-caret-right',
                    style: {
                        visibility: children.length > 0 ? 'visible' : 'hidden'
                    }
                };
                var rightLayerProp = {
                    className: 'layer ' + (children.length > 0 ? 'right-layer' : 'disable-layer')
                };
                if (!(me.state.disable || item.disable)) {
                    itemProp['data-ui-cmd'] = spanProp['data-ui-cmd'] = item.cmd;
                }
                return (
                    <div {...itemProp}>
                        <div {...rightArrowProp}></div>
                        <span {...spanProp}>{item.label}</span>
                        <div {...rightLayerProp}>{children.map(produceItem)}</div>
                    </div>
                );
            }
        }
    });
});
