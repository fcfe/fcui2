/**
 * 下拉地域选择器
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2.1
 */
define(function (require) {


    var React = require('react');
    var InputWidget = require('./mixins/InputWidget');

    
    var Layer = require('./Layer.jsx');
    var Region = require('./Region.jsx');
    var Button = require('./Button.jsx');


    var cTools = require('./core/componentTools');
    var language = require('./core/language').region.regionName;
    var buttonLabels = require('./core/language').rangeCalendar;


    return React.createClass({
        /**
         * @properties
         *
         * @param {Import|Properties} src\core\componentTools.js skin className style disabled
         * @param {String} label 下拉按钮上显示的文字，如果type为'single'并且value的值合法，将显示地域名称
         * @param {String} openLayerType 控制浮层打开的动作，onMouseEnter或onClick
         * @param {Import|Properties} src\Region.jsx.js type noLinkage provinceRenderer regionRenderer countryRenderer
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
                label: 'DropDownRegion',
                openLayerType: 'onMouseEnter',
                type: 'multi',
                noLinkage: false,
                provinceRenderer: undefined,
                regionRenderer: undefined,
                countryRenderer: undefined,
                // mixin
                valueTemplate: ''
            };
        },
        // @override
        componentWillReceiveProps: function(newProps) {
            this.setState({
                multiValue: newProps.value
            });
        },
        // @override
        getInitialState: function () {
            return {
                mouseenter: false,
                layerOpen: false,
                multiValue: this.props.value
            };
        },
        // @override
        componentDidMount: function () {
            this.___layerTimer___ = null;
            this.___closingTimer___ = null;
            document.body.addEventListener('click', this.onBodyClick);
        },
        // @override
        componentWillUnmount: function () {
            clearInterval(this.___layerTimer___);
            clearInterval(this.___closingTimer___);
            document.body.removeEventListener('click', this.onBodyClick);
        },
        onRegionChange: function (e) {
            var value = this.props.type === 'single' ? this.___getValue___() : this.state.multiValue;
            if (this.props.disabled || value === e.target.value) return;
            if (this.props.type === 'single') {
                this.___dispatchChange___(e);
                this.setState({layerOpen: false});
            }
            else {
                this.setState({multiValue: e.target.value});
            }
        },
        onEnterClick: function (e) {
            if (this.props.disabled) return;
            e.target = this.refs.container;
            e.target.value = this.state.multiValue;
            this.___dispatchChange___(e);
            this.setState({layerOpen: false});
        },
        onCancelClick: function () {
            this.setState({layerOpen: false});
        },
        onBodyClick: function () {
            if (
                this.props.type === 'single'
                || !this.refs.region
                || !this.state.layerOpen
                || this.refs.layer.state.mouseenter
                || this.refs.region.___currentLayer___
                || this.state.mouseenter
            ) {
                return;
            }
            this.setState({layerOpen: false});
        },
        onMainMouseEnter: function () {
            this.setState({mouseenter: true});
            if (this.props.openLayerType === 'onMouseEnter' && this.props.type === 'single') {
                this.open();
            }
        },
        onMainMouseLeave: function () {
            this.setState({mouseenter: false});
        },
        onLayerMouseLeave: function () {
            var me = this;
            clearInterval(me.___layerTimer___);
            me.___layerTimer___ = setInterval(leaving, 100);
            function leaving() {
                if (!me.refs.region || !me.state.layerOpen) {
                    clearInterval(me.___layerTimer___);
                    return;
                }
                if (me.refs.region.___currentLayer___ || me.refs.layer.state.mouseenter) {
                    return;
                }
                clearInterval(me.___layerTimer___);
                me.close();
            }
        },
        open: function () {
            this.setState({layerOpen: true});
        },
        close: function () {
            if (this.props.type !== 'single') return;
            var me = this;
            clearInterval(me.___closingTimer___);
            me.___closingTimer___ = setInterval(closing, 100);
            function closing() {
                if (!me.refs.region || !me.state.layerOpen) {
                    clearInterval(me.___layerTimer___);
                    return;
                }
                if (me.refs.layer.state.mouseenter || me.refs.region.___currentLayer___ || me.state.mouseenter) {
                    return;
                }
                clearInterval(me.___layerTimer___);
                me.setState({
                    mouseenter: false,
                    layerOpen: false
                });
            }
        },
        render: function () {
            var me = this;
            var value = this.___getValue___();
            var label = (this.props.type === 'single' && language[value]) ? language[value] : this.props.label;
            var containerProp = cTools.containerBaseProps('dropdownlist', this);
            var layerProp = {
                ref: 'layer',
                isOpen: this.state.layerOpen && !this.props.disabled,
                anchor: this.refs.container,
                location: 'bottom right',
                style: {padding: '5px 0'},
                onMouseEnter: this.onLayerMouseEnter,
                onMouseLeave: this.onLayerMouseLeave
            };
            var regionProp = {
                ref: 'region',
                value: this.props.type === 'single' ? this.___getValue___() : this.state.multiValue,
                disabled: this.props.disabled,
                type: this.props.type,
                noLinkage: this.props.noLinkage,
                provinceRenderer: this.props.provinceRenderer,
                regionRenderer: this.props.regionRenderer,
                countryRenderer: this.props.countryRenderer,
                onChange: this.onRegionChange
            };
            var enterProp = {
                label: buttonLabels.enter,
                skin: 'important',
                style: {margin: '5px 10px'},
                disabled: this.state.multiValue === me.props.value,
                onClick: this.onEnterClick
            };
            var cancelProp = {
                label: buttonLabels.cancel,
                onClick: this.onCancelClick
            };
            containerProp.onMouseEnter = this.onMainMouseEnter;
            containerProp.onMouseLeave = this.onMainMouseLeave;
            if (this.props.type !== 'single') {
                containerProp.onClick = this.open;
            }
            else if (this.props.openLayerType !== 'onMouseEnter') {
                containerProp[this.props.openLayerType] = this.open;
            }
            return (
                <div {...containerProp}>
                    <div className="icon-right font-icon font-icon-largeable-caret-down"></div>
                    <span>{label}</span>
                    <Layer {...layerProp}>
                        <div style={{maxWidth: 600}}>
                            <Region {...regionProp}/>
                            {this.props.type === 'single' ? null : <Button {...enterProp}/>}
                            {this.props.type === 'single' ? null : <Button {...cancelProp}/>}
                        </div>
                    </Layer>
                </div>
            );
        }
    });

});
