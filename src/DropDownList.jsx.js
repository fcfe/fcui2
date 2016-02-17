define(function (require) {

    var util = require('./core/util.es6');
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
                showLayer: false,
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
            this.hideLayer(e);
            e.stopPropagation();
        },
        fixedLayerPosition: function () {
            util.fixedLayerPositionTB(this.refs.container, this.refs.layer, this);
        },
        showLayer: function (e) {
            if (this.state.disable) return;
            this.setState({showLayer: !this.state.showLayer});
            this.fixedLayerPosition();
            e.stopPropagation();
        },
        hideLayer: function (e) {
            if (this.state.disable) return;
            this.setState({showLayer: false});
            e.stopPropagation();
        },
        render: function () {
            var me = this;
            var containerProp = {
                className: 'fcui2-dropdownlist layer-container',
                style: {minWidth: this.props.minWidth},
                onClick: this.clickHandler,
                onMouseEnter: this.showLayer,
                onMouseLeave: this.hideLayer,
                ref: 'container'
            };
            var layerProp = {
                className: 'layer ' + this.state.layerPosition,
                ref: 'layer'
            };
            if (this.state.disable) {
                containerProp.className += ' fcui2-dropdownlist-disable';
            }
            else if (this.state.showLayer) {
                containerProp.className += ' layer-container-showlayer';
            }
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
