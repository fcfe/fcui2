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
         * @param {boolean} readonly 为true时region浮层只读。
         *                           region设置为multi时，内部状态控件内部维护且由ok点击传出，不能
         *                           通过不设置handler表达只读，设置额外的flag。
         * @param {Import|Properties} src\Region.jsx.js type noLinkage provinceRenderer regionRenderer countryRenderer
         * @param {Import|Properties} src\Region.jsx.js countries
         * @param {Import|Properties} src\mixins\InputWidget.js
         *      value onChange name validations customErrorTemplates valueTemplate
         */
        /**
         * @fire Import src\mixins\InputWidget.js XXX onChange
         */
        // @override
        contextTypes: {
            appSkin: React.PropTypes.string
        },
        // @override
        mixins: [InputWidget],
        // @override
        getDefaultProps: function getDefaultProps() {
            return {
                // base
                skin: '',
                className: '',
                style: {},
                disabled: false,
                readonly: false,
                // self
                label: 'DropDownRegion',
                openLayerType: 'onMouseEnter',
                type: 'multi',
                allowEmpty: false,
                noLinkage: false,
                provinceRenderer: undefined,
                regionRenderer: undefined,
                countryRenderer: undefined,
                countries: undefined,
                layerLocation: 'bottom right',
                onLayerOffset: undefined,
                // hidden the checkbox and the label of a region when regionFilter returns false
                regionFilter: function regionFilter() {
                    return true;
                },
                // mixin
                valueTemplate: ''
            };
        },
        // @override
        componentWillReceiveProps: function componentWillReceiveProps(newProps) {
            this.setState({
                multiValue: newProps.value
            });
        },
        // @override
        getInitialState: function getInitialState() {
            return {
                mouseenter: false,
                layerOpen: false,
                multiValue: this.props.value
            };
        },
        // @override
        componentDidMount: function componentDidMount() {
            this.___layerTimer___ = null;
            this.___closingTimer___ = null;
            document.body.addEventListener('click', this.onBodyClick);
        },
        // @override
        componentWillUnmount: function componentWillUnmount() {
            clearInterval(this.___layerTimer___);
            clearInterval(this.___closingTimer___);
            document.body.removeEventListener('click', this.onBodyClick);
        },
        onRegionChange: function onRegionChange(e) {
            var value = this.props.type === 'single' ? this.___getValue___() : this.state.multiValue;
            if (this.props.disabled || value === e.target.value) return;
            if (this.props.type === 'single') {
                this.___dispatchChange___(e);
                this.setState({ layerOpen: false });
            } else {
                this.setState({ multiValue: e.target.value });
            }
        },
        onEnterClick: function onEnterClick(e) {
            if (this.props.disabled) return;
            e = { target: this.refs.container };
            e.target.value = this.state.multiValue;
            this.___dispatchChange___(e);
            this.setState({ layerOpen: false });
        },
        onCancelClick: function onCancelClick() {
            this.setState({ layerOpen: false });
        },
        onBodyClick: function onBodyClick() {
            if (this.props.type === 'single' || !this.refs.region || !this.state.layerOpen || this.refs.layer.state.mouseenter || this.refs.region.___currentLayer___ || this.state.mouseenter) {
                return;
            }
            this.setState({ layerOpen: false });
        },
        onMainMouseEnter: function onMainMouseEnter() {
            this.setState({ mouseenter: true });
            if (this.props.openLayerType === 'onMouseEnter' && this.props.type === 'single') {
                this.open();
            }
        },
        onMainMouseLeave: function onMainMouseLeave() {
            this.setState({ mouseenter: false });
        },
        onLayerMouseLeave: function onLayerMouseLeave() {
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
        open: function open() {
            this.setState({ layerOpen: true });
        },
        close: function close() {
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
        render: function render() {
            var me = this;
            var value = this.___getValue___();
            var label = this.props.type === 'single' && language[value] ? language[value] : this.props.label;
            var containerProp = cTools.containerBaseProps('dropdownlist', this, { widthCorrect: -12 });
            var layerProp = {
                ref: 'layer',
                className: this.props.className,
                isOpen: this.state.layerOpen && !this.props.disabled,
                anchor: this.refs.container,
                location: this.props.layerLocation,
                style: { padding: '5px 0' },
                onMouseEnter: this.onLayerMouseEnter,
                onMouseLeave: this.onLayerMouseLeave,
                skin: this.context.appSkin ? this.context.appSkin + '-normal' : 'normal'
            };
            if (typeof this.props.onLayerOffset === 'function') {
                layerProp.onOffset = this.props.onLayerOffset;
            }
            var regionProp = {
                ref: 'region',
                value: this.props.type === 'single' ? this.___getValue___() : this.state.multiValue,
                disabled: this.props.disabled,
                type: this.props.type,
                noLinkage: this.props.noLinkage,
                regionFilter: this.props.regionFilter,
                provinceRenderer: this.props.provinceRenderer,
                regionRenderer: this.props.regionRenderer,
                countryRenderer: this.props.countryRenderer,
                countries: this.props.countries,
                onChange: this.props.readonly ? null : this.onRegionChange
            };
            var enterProp = {
                label: buttonLabels.enter,
                skin: 'important',
                style: { margin: '5px 10px' },
                disabled: this.state.multiValue === me.props.value || !this.state.multiValue,
                onClick: this.onEnterClick
            };
            var cancelProp = {
                label: buttonLabels.cancel,
                onClick: this.onCancelClick
            };
            containerProp.onMouseEnter = this.onMainMouseEnter;
            containerProp.onMouseLeave = this.onMainMouseLeave;
            if (this.props.allowEmpty && !this.state.multiValue) {
                enterProp.disabled = false;
            }
            if (this.props.type !== 'single') {
                containerProp.onClick = this.open;
            } else if (this.props.openLayerType !== 'onMouseEnter') {
                containerProp[this.props.openLayerType] = this.open;
            }
            var skin = this.props.skin ? this.props.skin : 'normal';
            skin = this.context.appSkin ? this.context.appSkin + '-' + skin : skin;
            containerProp.className += layerProp.isOpen ? ' fcui2-dropdownlist-' + skin + '-hover' : '';
            return React.createElement(
                'div',
                containerProp,
                React.createElement('div', { className: 'icon-right fcui2-icon fcui2-icon-arrow-down' }),
                React.createElement(
                    'span',
                    { className: 'label-container' },
                    label
                ),
                React.createElement(
                    Layer,
                    layerProp,
                    React.createElement(
                        'div',
                        { style: { maxWidth: 600 } },
                        React.createElement(Region, regionProp),
                        this.props.type === 'multi' && !this.props.readonly ? React.createElement(Button, enterProp) : null,
                        this.props.type === 'multi' && !this.props.readonly ? React.createElement(Button, cancelProp) : null
                    )
                )
            );
        }
    });
});