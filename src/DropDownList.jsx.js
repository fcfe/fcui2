define(function (require) {
    return React.createClass({
        // @override
        getDefaultProps: function () {
            return {
                minWidth: 60,
                label: 'DropDownList',
                datasource: [],         // {label: <string>, cmd: <string>, disable: <boolean>}
                onClick: function () {}
            };
        },
        // @override
        getInitialState: function () {
            return {
                disable: this.props.hasOwnProperty('disable') ? this.props.disable : false,
                datasource: JSON.parse(JSON.stringify(this.props.datasource))
            };
        },
        clickHandler: function (e) {
            if (this.state.disable || !e.target.dataset.uiCmd) return;
            this.props.onClick({
                target: this,
                value: e.target.dataset.uiCmd
            });
            e.stopPropagation();
        },
        render: function () {
            var me = this;
            var containerProp = {
                className: 'ui-dropdownlist',
                style: {
                    minWidth: this.props.minWidth
                },
                onClick: this.clickHandler
            };
            if (this.state.disable) {
                containerProp.className += ' ui-button-disable';
            }
            return (
                <div {...containerProp}>
                    <div className="icon-right font-icon font-icon-largeable-caret-down"></div>
                    <span>{this.props.label}</span>
                    <div className="layer bottom-layer">{this.state.datasource.map(produceItem)}</div>
                </div>
            );
            function produceItem(item) {
                var children = item.datasource instanceof Array ? item.datasource : [];
                var itemProp = {
                    onClick: me.clickHandler,
                    className: 'item' + (me.state.disable || item.disable ? ' disable' : '')
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
