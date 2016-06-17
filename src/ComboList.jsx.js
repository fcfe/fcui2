/**
 * 组合下拉列表
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
         * @param {String} label 主按钮上显示的文字
         * @param {String} icon 主按钮上显示的图标，具体见src/css/icon/variable.less
         * @param {String} value 主按钮的值，发生点击后随事件对象返回给回调
         * @param {Array.<ListItemObject>} datasource 列表数据源
         * @param {Function} onClick 发生点击后的回调
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
                label: 'ComboList',
                icon: '',
                value: '',
                datasource: [], // 见List
                onClick: function () {}
            };
        },
        // @override
        getInitialState: function () {
            return {
                layerOpen: false
            };
        },
        // 列表被点击
        onListClick: function (e) {
            if (this.props.disabled) return;
            this.props.onClick(e);
            this.setState({layerOpen: false});  
        },
        // 主按钮被点击
        onMainButtonClick: function (e) {
            if (this.props.disabled) return;
            e.target = this.refs.container;
            e.target.value = this.props.value;
            this.setState({layerOpen: false});
            this.props.onClick(e);
        },
        // 右侧下拉按钮被点击，弹出列表layer
        onDropDownButtonClick: function (e) {
            if (this.props.disabled) return;
            this.setState({layerOpen: true});
            e.stopPropagation();
        },
        // 鼠标移出组件区域，关闭layer
        onMouseLeave: function (e) {
            if (this.props.disabled) return;
            cTools.closeLayerHandler.call(this);
        },
        render: function () {
            var me = this;
            var containerProp = cTools.containerBaseProps('combolist', this, {
                merge: {
                    onMouseLeave: this.onMouseLeave,
                    onClick: this.onMainButtonClick
                }
            });
            var dropdownButtonProp = {
                className: 'icon-right font-icon font-icon-largeable-caret-down',
                style: {
                    backgroundColor: this.state.layerOpen ? '#FFF' : undefined,
                    color: this.state.layerOpen ? '#4593FF' : undefined,
                },
                onClick: this.onDropDownButtonClick
            };
            var layerProp = {
                ref: 'layer',
                isOpen: this.state.layerOpen && this.props.datasource.length && !this.props.disabled,
                anchor: this.refs.container,
                onMouseLeave: this.onMouseLeave,
                style: {
                    maxHeight: '240px',
                    overflow: 'auto'
                }
            };
            var listProp = {
                datasource: this.props.datasource,
                ref: 'list',
                onClick: this.onListClick
            };
            return (
                <div {...containerProp}>
                    <div {...dropdownButtonProp}></div>
                    <span className={'font-icon ' + this.props.icon}>{this.props.label}</span>
                    <Layer {...layerProp}>
                        <List {...listProp}/>
                    </Layer>
                </div>
            );
        }
    });
});
