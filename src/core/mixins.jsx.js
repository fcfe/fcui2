define(function (require) {
    var util = require('./util.es6');
    var React = require('react');
    return {
        layerContainer: {
            fixedLayerPosition: function () {
                util.fixedLayerPositionTB(this.refs.container, this.refs.layer, this);
            },
            showLayer: function () {
                if (this.state.disable) return;
                this.setState({showLayer: !this.state.showLayer});
                this.fixedLayerPosition();
            },
            hideLayer: function () {
                if (this.state.disable) return;
                this.setState({showLayer: false});
            }
        },
        layerList: {
            produceList: function (item, index) {
                var me = this;
                var children = item.datasource instanceof Array ? item.datasource : [];
                var itemProp = {
                    onClick: me.clickHandler,
                    className: 'item' + (me.state.disable || item.disable ? ' disable' : ''),
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
                if (!(me.state.disable || item.disable)) {
                    itemProp['data-ui-cmd'] = spanProp['data-ui-cmd'] = item.value;
                }
                return (
                    <div {...itemProp}>
                        <div {...rightArrowProp}></div>
                        <span {...spanProp}>{item.label}</span>
                        <div {...rightLayerProp}>{children.map(this.produceList)}</div>
                    </div>
                );
            }
        }
    };
});