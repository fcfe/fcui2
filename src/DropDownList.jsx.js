/**
 * @file 下拉控制列表组件
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2
 */
define(function (require) {


    var React = require('react');
    var Layer = require('./Layer.jsx');
    var List = require('./List.jsx');
    var cTools = require('./core/componentTools');


    return React.createClass({
        // @override
        getDefaultProps: function () {
            return {
                skin: '',
                className: '',
                style: {},
                disabled: false,
                label: 'DropDownList',
                datasource: [],
                onClick: cTools.noop
            };
        },
        getInitialState: function () {
            return {
                layerOpen: false
            };
        },
        onListClick: function (e) {
            if (this.props.disabled) return;
            this.props.onClick(e);
            this.setState({layerOpen: false});
        },
        render: function () {
            var me = this;
            var containerProp = cTools.containerBaseProps('dropdownlist', this, {
                merge: {
                    onMouseEnter: cTools.openLayerHandler.bind(this),
                    onMouseLeave: cTools.closeLayerHandler.bind(this)
                }
            });
            var layerProp = {
                ref: 'layer',
                onMouseLeave: cTools.closeLayerHandler.bind(this),
                isOpen: this.state.layerOpen && !this.props.disabled && this.props.datasource.length,
                anchor: this.refs.container,
                style: {
                    minWidth: '150px',
                    maxHeight: '240px',
                    overflow: 'auto'
                }
            };
            var listProp = {
                datasource: this.props.datasource,
                onClick: this.onListClick
            };
            return (
                <div {...containerProp}>
                    <div className="icon-right font-icon font-icon-largeable-caret-down"></div>
                    <span>{this.props.label}</span>
                    <Layer {...layerProp}>
                        <List {...listProp} />
                    </Layer>
                </div>
            );
        }
    });
});
