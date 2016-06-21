/**
 * 选择器
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2.1
 */
define(function (require) {


    var React = require('react');
    var InputWidget = require('./mixins/InputWidget');
    
    var Layer = require('./Layer.jsx');
    var List = require('./List.jsx');
    var cTools = require('./core/componentTools');


    return React.createClass({
        /**
         * @properties
         *
         * @param {Import|Properties} src\core\componentTools.js skin className style disabled
         * @param {String} placeholder 组件为选择且无初始值时，下拉按钮上显示的值
         * @param {String} openLayerType 控制浮层打开的动作，onMouseEnter或onClick
         * @param {Array.<ListItemObject>} datasource 列表数据源
         * @param {Import|Properties} src\mixins\InputWidget.js
         *      value onChange name validations customErrorTemplates valueLink valueTemplate
         */
        /**
         * @structure Import src\List.jsx.js ListItemObject
         */
        /**
         * @fire Import src\mixins\InputWidget.js XXX onChange
         */
        // @override
        mixins: [InputWidget],
        // @override
        getDefaultProps: function () {
            return {
                // base
                skin: '',
                className: '',
                style: {},
                disabled: false,
                // mixin
                placeholder: 'please select',
                openLayerType: 'onMouseEnter',
                datasource: [],
                // mixin
                valueTemplate: ''
            };
        },
        // @override
        getInitialState: function () {
            return {
                layerOpen: false,
                mouseenter: false
            };
        },
        onListClick: function (e) {
            var value = this.___getValue___();
            if (this.props.disabled || value === e.target.value) return;
            this.___dispatchChange___(e);
            this.setState({layerOpen: false});
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
        render: function () {
            var me = this;
            var label = this.props.placeholder;
            var value = this.___getValue___();
            var containerProp = cTools.containerBaseProps('dropdownlist', this);
            var layerProp = {
                ref: 'layer',
                isOpen: this.state.layerOpen && this.props.datasource.length && !this.props.disabled,
                anchor: this.refs.container,
                onMouseLeave: cTools.closeLayerHandlerFactory(this, 'layerOpen'),
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
            containerProp[this.props.openLayerType] = this.onMouseEnter;
            containerProp.onMouseLeave = this.onMouseLeave;
            for (var i = 0; i < this.props.datasource.length; i++) {
                if (this.props.datasource[i].value + '' === value + '') {
                    label = this.props.datasource[i].label;
                    break;
                }
            }
            return (
                <div {...containerProp}>
                    <div className="icon-right font-icon font-icon-largeable-caret-down"></div>
                    <div className="label-container">{label}</div>
                    <Layer {...layerProp}>
                        <List {...listProp}/>
                    </Layer>
                </div>
            );
        }
    });
});
