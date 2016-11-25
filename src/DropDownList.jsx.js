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
         * @param {Boolean} hideLayerScroll 是否隐藏下拉菜单的滚动条
         * @param {ReactClass} itemRenderer 列表项渲染器
         * @param {Function} onClick 点击列表后的回调
         */
        /**
         * @structure Import src\List.jsx.js ListItemObject
         */
        /**
         * @fire Import src\components\list\NormalRenderer.jsx.js List onClick
         */
        // @override
        getDefaultProps: function () {
            return {
                // base
                skin: '',
                className: '',
                style: {},
                disabled: false,
                // self
                itemRenderer: undefined,
                label: 'DropDownList',
                openLayerType: 'onMouseEnter',
                layerLocation: '6',
                hideLayerScroll: false,
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
            cTools.closeLayerHandlerFactory(this, 'layerOpen')();
        },
        onListClick: function (e) {
            this.setState({layerOpen: false});
            this.props.onClick(e);
        },
        render: function () {
            var me = this;
            var containerProp = cTools.containerBaseProps('dropdownlist', this, {widthCorrect: -12});
            var layerProp = {
                ref: 'layer',
                onMouseLeave: cTools.closeLayerHandlerFactory(this, 'layerOpen'),
                isOpen: this.state.layerOpen && !this.props.disabled && !!this.props.datasource.length,
                anchor: this.refs.container,
                location: this.props.layerLocation
            };
            var listProp = {
                itemRenderer: this.props.itemRenderer,
                datasource: this.props.datasource,
                onClick: this.onListClick,
                style: {
                    maxHeight: '242px',
                    overflowY: 'auto',
                    overflowX: 'hidden'
                }
            };
            if (this.props.hideLayerScroll) {
                delete listProp.style;
            }
            containerProp[this.props.openLayerType] = this.onMouseEnter;
            containerProp.onMouseLeave = this.onMouseLeave;
            containerProp.className += layerProp.isOpen ? ' fcui2-dropdownlist-hover' : '';
            return (
                <div {...containerProp}>
                    <div className="icon-right font-icon font-icon-largeable-caret-down"></div>
                    <span className="label-container">{this.props.label}</span>
                    <Layer {...layerProp}>
                        <List {...listProp} />
                    </Layer>
                </div>
            );
        }
    });
});
