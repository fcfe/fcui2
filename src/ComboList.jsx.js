define(function (require) {

    var React = require('react');
    var Button = require('./Button.jsx');
    var util = require('./core/util.es6');
    var mixins = require('./core/mixins.jsx');

    return React.createClass({
        // @override
        mixins: [mixins.layerContainer, mixins.layerList],
        // @override
        getDefaultProps: function () {
            return {
                label: 'ComboList',
                icon: '',
                cmd: '',
                disable: false,
                datasource: [], // {label: <string>, cmd: <string>, disable: <boolean>, datasource:[#self]}
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
            this.hideLayer();
        },
        mainButtonHandler: function (e) {
            if (this.state.disable) return;
            this.props.onClick({
                target: this,
                value: this.props.cmd
            });
            this.hideLayer();
        },
        render: function () {
            var me = this;
            var containerProp = {
                className: 'fcui2-combolist layer-container',
                onMouseLeave: this.hideLayer,
                ref: 'container'
            };
            var mainButtonProp = {
                label: this.props.label,
                disable: this.state.disable,
                cmd: this.props.cmd,
                icon: this.props.icon,
                skin: 'important',
                onClick: this.mainButtonHandler
            };
            var layerProp = {
                className: 'layer ' + this.state.layerPosition,
                ref: 'layer'
            };
            if (this.state.disable) {
                containerProp.className += ' fcui2-combolist-disable';
            }
            else if (this.state.showLayer) {
                containerProp.className += ' layer-container-showlayer';
            }
            return (
                <div {...containerProp}>
                    <div className="font-icon font-icon-largeable-caret-down" onClick={this.showLayer}></div>
                    <Button {...mainButtonProp}/>
                    <div {...layerProp}>{this.state.datasource.map(this.produceList)}</div>
                </div>
            );
        }
    });
});
