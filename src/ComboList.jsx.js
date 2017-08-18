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
        contextTypes: {
            appSkin: React.PropTypes.string
        },
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
            cTools.closeLayerHandlerFactory(this, 'layerOpen')();
        },
        render: function () {
            var me = this;
            var containerProp = cTools.containerBaseProps('combolist', this, {
                merge: {
                    onMouseLeave: this.onMouseLeave,
                    onClick: this.onMainButtonClick
                },
                widthCorrect: -2
            });
            var hasDatasource = this.props.datasource instanceof Array && this.props.datasource.length > 0;
            var dropdownButtonProp = {
                className: 'icon-right fcui2-icon fcui2-icon-arrow-down'
                    + (this.state.layerOpen && hasDatasource && !this.props.disabled ? ' layerOpen' : ''),
                onClick: this.onDropDownButtonClick
            };
            var labelProp = {
                className: 'label-container'
                    + (hasDatasource ? ' marginRight' : '')
                    + (this.props.icon ? (' font-icon ' + this.props.icon) : '')
            };
            var layerProp = {
                ref: 'layer',
                isOpen: this.state.layerOpen && hasDatasource && !this.props.disabled,
                anchor: this.refs.container,
                onMouseLeave: this.onMouseLeave,
                skin: this.context.appSkin ? (this.context.appSkin + '-important') : 'normal'
            };
            var listProp = {
                datasource: this.props.datasource,
                ref: 'list',
                skin: 'important',
                onClick: this.onListClick,
                style: {
                    maxHeight: '242px',
                    overflowY: 'auto',
                    overflowX: 'hidden'
                }
            };
            return (
                <div {...containerProp}>
                    {hasDatasource ? <div {...dropdownButtonProp}></div> : null}
                    {hasDatasource ? <div className="spliter"></div> : null}
                    <span {...labelProp}>
                        {this.props.label}
                    </span>
                    <Layer {...layerProp}>
                        <List {...listProp}/>
                    </Layer>
                </div>
            );
        }
    });
});
