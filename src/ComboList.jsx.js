define(function (require) {

    var Button = require('./Button.jsx');
    var util = require('./core/util');

    return React.createClass({
        // @override
        getDefaultProps: function () {
            return {
                label: 'ComboList',
                icon: '',
                cmd: '',
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
        fixedLayerPosition: function () {
            util.fixedLayerPositionTB(this.getDOMNode(), this.refs.layer.getDOMNode(), this);
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
        mainButtonHandler: function (e) {
            if (this.state.disable) return;
            this.props.onClick({
                target: this,
                value: this.props.cmd
            });
        },
        dropdownButtonHandler: function (e) {
            if (this.state.disable) return;
            this.setState({showLayer: !this.state.showLayer});
            this.fixedLayerPosition();
            e.stopPropagation();
        },
        hideLayer: function (e) {
            if (this.state.disable) return;
            this.setState({
                showLayer: false
            });
            e.stopPropagation();
        },
        render: function () {
            var me = this;
            var containerProp = {
                className: 'fcui2-combolist',
                onMouseLeave: this.hideLayer
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
                containerProp.className += ' fcui2-combolist-showlayer';
            }
            return (
                <div {...containerProp}>
                    <div className="font-icon font-icon-largeable-caret-down" onClick={this.dropdownButtonHandler}></div>
                    <Button {...mainButtonProp}/>
                    <div {...layerProp}>{this.state.datasource.map(produceItem)}</div>
                </div>
            );
            function produceItem(item) {
                var children = item.datasource instanceof Array ? item.datasource : [];
                var itemProp = {
                    onClick: me.clickHandler,
                    className: 'item' + (me.state.disable || item.disable ? ' disable' : '')
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
