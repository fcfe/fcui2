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
         *      value onChange name validations customErrorTemplates valueLink valueTemplate
         */
        // @override
        propTypes: {
            // base
            skin: React.PropTypes.string,
            className: React.PropTypes.string,
            style: React.PropTypes.object,
            disabled: React.PropTypes.bool,
            // self
            placeholder: React.PropTypes.string,
            min: React.PropTypes.string,
            max: React.PropTypes.string,
            openLayerType: React.PropTypes.string,
            // mixin
            value: React.PropTypes.string,
            valueLink: React.PropTypes.object,
            name: React.PropTypes.string,
            onChange: React.PropTypes.func,
            validations: React.PropTypes.object,
            customErrorTemplates: React.PropTypes.object,
            valueTemplate: React.PropTypes.string
        },
        // @override
        mixins: [InputWidget],
        // @override
        getDefaultProps: function () {
            return {
                skin: '',
                className: '',
                style: {},
                disabled: false,
                placeholder: 'please select',
                openLayerType: 'onMouseEnter',
                min: '0-1-1',
                max: '9999-12-31',
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
            cTools.closeLayerHandler.call(this);
        },
        render: function () {
            var me = this;
            var containerProp = cTools.containerBaseProps('dropdownlist', this);
            var label = this.___getValue___() || this.props.placeholder;
            var layerProp = {
                isOpen: this.state.layerOpen && !this.props.disabled,
                anchor: this.refs.container,
                onMouseLeave: cTools.closeLayerHandler.bind(this),
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
            return (
                <div {...containerProp}>
                    <div className="icon-right font-icon font-icon-calendar"></div>
                    <div className="label-container">{label}</div>
                    <Layer {...layerProp}>
                        <Calendar {...calendarProp} />
                    </Layer>
                </div>
            );
        }
    });
});
