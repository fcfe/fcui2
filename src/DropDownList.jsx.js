/**
 * 下拉列表
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2.1
 */
define(function (require) {


    var React = require('react');
    var Layer = require('./Layer.jsx');
    var List = require('./List.jsx');
    var cTools = require('./core/componentTools');


    return React.createClass({
        /**
         * @properties
         *
         * @param {Import|Properties} src\core\componentTools.js skin className style disabled
         * @param {String} label 下拉按钮上显示的文字
         * @param {String} openLayerType 控制浮层打开的动作，onMouseEnter或onClick
         * @param {Array.<ListItemObject>} datasource 列表数据源
         * @param {Function} onClick 点击列表后的回调
         */
        /**
         * @structure Import src\List.jsx.js ListItemObject
         */
        // @override
        propTypes: {
            // base
            skin: React.PropTypes.string,
            className: React.PropTypes.string,
            style: React.PropTypes.object,
            disabled: React.PropTypes.bool,
            // self
            label: React.PropTypes.string,
            openLayerType: React.PropTypes.string,
            datasource: React.PropTypes.array,
            onClick: React.PropTypes.func
        },
        // @override
        getDefaultProps: function () {
            return {
                skin: '',
                className: '',
                style: {},
                disabled: false,
                label: 'DropDownList',
                openLayerType: 'onMouseEnter',
                datasource: [],
                onClick: cTools.noop
            };
        },
        getInitialState: function () {
            return {
                layerOpen: false,
                mouseenter: false
            };
        },
        onMouseEnter: function () {
            this.setState({
                mouseenter: true,
                layerOpen: true
            });
        },
        onMouseLeave: function () {
            this.setState({mouseenter: false});
            cTools.closeLayerHandler.call(this);
        },
        onListClick: function (e) {
            if (this.props.disabled) return;
            this.props.onClick(e);
            this.setState({layerOpen: false});
        },
        render: function () {
            var me = this;
            var containerProp = cTools.containerBaseProps('dropdownlist', this);
            var layerProp = {
                ref: 'layer',
                onMouseLeave: cTools.closeLayerHandler.bind(this),
                isOpen: this.state.layerOpen && !this.props.disabled && this.props.datasource.length,
                anchor: this.refs.container,
                style: {
                    maxHeight: '240px',
                    overflow: 'auto'
                }
            };
            var listProp = {
                datasource: this.props.datasource,
                onClick: this.onListClick
            };
            containerProp[this.props.openLayerType] = this.onMouseEnter;
            containerProp.onMouseLeave = this.onMouseLeave;
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
