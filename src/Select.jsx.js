define(function (require) {

    var util = require('./core/util.es6');
    var mixins = require('./core/mixins.jsx');
    var React = require('react');

    return React.createClass({
        // @override
        mixins: [mixins.layerContainer, mixins.layerList],
        // @override
        getDefaultProps: function () {
            return {
                className: '',
                minWidth: 60,
                label: 'please select',
                value: '',
                disable: false,
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
                this.hideLayer();
                return;
            }
            this.setState({value: dataset.uiCmd});
            this.props.onChange({
                target: this,
                value: dataset.uiCmd
            });
            this.hideLayer();
        },
        render: function () {
            var me = this;
            var containerProp = {
                className: 'fcui2-dropdownlist layer-container ' + this.props.className,
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
                    <div {...layerProp}>{this.state.datasource.map(this.produceList)}</div>
                </div>
            );
        }
    });
});
