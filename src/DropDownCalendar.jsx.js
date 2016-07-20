/**
 * 下拉日期选择器
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2.1
 */
define(function (require) {


    var React = require('react');
    var InputWidget = require('./mixins/InputWidget');
    var Layer = require('./Layer.jsx');
    var Calendar = require('./Calendar.jsx');
    var cTools = require('./core/componentTools');



    return React.createClass({
        /**
         * @properties
         *
         * @param {Import|Properties} src\core\componentTools.js skin className style disabled
         * @param {Import|Properties} src\Calendar.jsx.js min max
         * @param {String} placeholder 组件为选择且无初始值时，下拉按钮上显示的值
         * @param {String} openLayerType 控制浮层打开的动作，onMouseEnter或onClick
         * @param {Import|Properties} src\mixins\InputWidget.js
         *      value onChange name validations customErrorTemplates valueTemplate
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
                // self
                placeholder: 'please select',
                openLayerType: 'onMouseEnter',
                min: '0-1-1',
                max: '9999-12-31',
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
        onChange: function (e) {
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
            var containerProp = cTools.containerBaseProps('dropdownlist', this, {widthCorrect: -12});
            var label = this.___getValue___() || this.props.placeholder;
            var layerProp = {
                isOpen: this.state.layerOpen && !this.props.disabled,
                anchor: this.refs.container,
                onMouseLeave: cTools.closeLayerHandlerFactory(this, 'layerOpen'),
                ref: 'layer'
            };
            var calendarProp = {
                min: this.props.min,
                max: this.props.max,
                value: this.___getValue___(),
                onChange: this.onChange
            };
            containerProp[this.props.openLayerType] = this.onMouseEnter;
            containerProp['onMouseLeave'] = this.onMouseLeave;
            containerProp.className += layerProp.isOpen ? ' fcui2-dropdownlist-hover' : '';
            return (
                <div {...containerProp}>
                    <div className="icon-right font-icon font-icon-calendar"></div>
                    <span className="label-container">{label}</span>
                    <Layer {...layerProp}>
                        <Calendar {...calendarProp} />
                    </Layer>
                </div>
            );
        }
    });
});
