define(function (require) {

    var util = require('./core/util.es6');
    var React = require('react');

    return React.createClass({
        // @override
        getDefaultProps: function () {
            return {
                minWidth: 60,
                label: 'please select',
                disable: false,
                value: '',
                datasource: [],         // {label: <string>, value: <string>, disable: <boolean>}
                onChange: function () {}
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
                value: this.props.value + '',
                datasource: JSON.parse(JSON.stringify(this.props.datasource)),
                showLayer: false,
                layerPosition: 'bottom-layer'
            };
        },
        clickHandler: function (e) {
            var dataset = util.getDataset(e.target);
            if (this.state.disable || !dataset.uiCmd || this.state.value === dataset.uiCmd) {
                this.hideLayer(e);
                return;
            }
            this.setState({value: dataset.uiCmd});
            this.props.onChange({
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
            var label = this.props.label;
            for (var i = 0; i < this.state.datasource.length; i++) {
                if (this.state.datasource[i].value + '' === this.state.value + '') {
                    label = this.state.datasource[i].label;
                    break;
                }
            }
            return (
                <div {...containerProp}>
                    <div className="icon-right font-icon font-icon-largeable-caret-down"></div>
                    <span>{label}</span>
                    <div {...layerProp}>{this.state.datasource.map(produceItem)}</div>
                </div>
            );
            function produceItem(item, index) {
                var itemProp = {
                    onClick: me.clickHandler,
                    className: 'item' + (me.state.disable || item.disable ? ' disable' : ''),
                    key: index
                };
                var spanProp = {onClick: me.clickHandler};
                if (!(me.state.disable || item.disable)) {
                    itemProp['data-ui-cmd'] = spanProp['data-ui-cmd'] = item.value;
                }
                return (
                    <div {...itemProp}>
                        <span {...spanProp}>{item.label}</span>
                    </div>
                );
            }
        }
    });
});
