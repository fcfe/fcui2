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
                layerPosition: 'bottom-layer'
            };
        },
        clickHandler: function (e) {
            var dataset = util.getDataset(e.target);
            if (this.state.disable || !dataset.uiCmd) return;
            this.setState({value: dataset.uiCmd});
            this.props.onChange({
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
