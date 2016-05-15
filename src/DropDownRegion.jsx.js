/**
 * @file 下拉地域选择器组件
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.1
 */
define(function (require) {


    var React = require('react');
    var InputWidgetBase = require('./mixins/InputWidgetBase');
    var InputWidgetInForm = require('./mixins/InputWidgetInForm');
    var Layer = require('./Layer.jsx');
    var Region = require('./Region.jsx');
    var Button = require('./Button.jsx');


    var language = require('./core/language').region.regionName;
    var buttonLabels = require('./core/language').rangeCalendar;


    return React.createClass({
        // @override
        mixins: [InputWidgetBase, InputWidgetInForm],
        // @override
        getDefaultProps: function () {
            return {
                className: '',
                label: 'DropDownRegion',
                minWidth: 60,
                width: NaN,
                disabled: false,
                shortCut: [],
                type: 'multi',
                provinceRenderer: undefined,
                regionRenderer: undefined,
                countryRenderer: undefined,
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
                layerOpen: false,
                multiValue: this.props.value
            };
        },
        // @override
        componentDidMount: function () {
            this.___autoCloseTimer___ = null;
        },
        regionChangeHandler: function (e) {
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
        mainButtonClickHandler: function (e) {
            if (this.props.disabled) return;
            this.setState({layerOpen: true});
        },
        enterButtonClickHandler: function (e) {
            if (this.props.disabled) return;
            e.target = this.refs.container;
            e.target.value = this.state.multiValue;
            this.___dispatchChange___(e);
            this.setState({layerOpen: false});
        },
        cancelButtonClickHandler: function (e) {
            this.setState({layerOpen: false});
        },
        layerMouseLeaveHandler: function (e) {
            var me = this;
            clearInterval(me.___autoCloseTimer___);
            me.___autoCloseTimer___ = setInterval(function () {
                if (!me.refs.region) {
                    clearInterval(me.___autoCloseTimer___);
                    return;
                }
                if (me.refs.region.___currentLayer___ || me.refs.layer.state.mouseenter) return;
                clearInterval(me.___autoCloseTimer___);
                me.setState({layerOpen: false});
            }, 100);
        },
        buttonFactory: function () {
            if (this.props.type === 'single') return '';
            var buttonContainerProp = {
                style: {
                    position: 'absolute',
                    top: 365,
                    left: 15
                }
            };
            var enterProp = {
                label: buttonLabels.enter,
                skin: 'important',
                disabled: this.state.multiValue === this.props.value,
                onClick: this.enterButtonClickHandler
            };
            var cancelProp = {
                style: {
                    position: 'relative',
                    left: 10
                },
                label: buttonLabels.cancel,
                onClick: this.cancelButtonClickHandler
            };
            return (
                <div {...buttonContainerProp}>
                    <Button {...enterProp}/>
                    <Button {...cancelProp}/>
                </div>
            );
        },
        render: function () {
            var me = this;
            var value = this.___getValue___();
            var containerProp = {
                className: 'fcui2-dropdownlist ' + this.props.className,
                style: {minWidth: this.props.minWidth},
                onClick: this.mainButtonClickHandler,
                ref: 'container'
            };
            var label = (this.props.type === 'single' && language[value]) ? language[value] : this.props.label;
            if (this.props.disabled) {
                containerProp.className += ' fcui2-dropdownlist-disabled';
            }
            if (!isNaN(this.props.width)) {
                delete containerProp.style.minWidth;
                containerProp.style.width = this.props.width;
            }
            var layerProp = {
                ref: 'layer',
                isOpen: this.state.layerOpen && !this.props.disabled,
                anchor: this.refs.container,
                location: 'bottom',
                style: {padding: '5px 0'},
                closeWithBodyClick: this.props.type === 'single',
                onCloseByWindow: this.props.type === 'single' ? this.cancelButtonClickHandler : undefined,
                onMouseLeave: this.props.type === 'single' ? this.layerMouseLeaveHandler : undefined
            };
            var regionProp = {
                ref: 'region',
                value: this.props.type === 'single' ? this.___getValue___() : this.state.multiValue,
                disabled: this.props.disabled,
                type: this.props.type,
                provinceRenderer: this.props.provinceRenderer,
                regionRenderer: this.props.regionRenderer,
                countryRenderer: this.props.countryRenderer,
                onChange: this.regionChangeHandler
            };
            return (
                <div {...containerProp}>
                    <div className="icon-right font-icon font-icon-largeable-caret-down"></div>
                    <span>{label}</span>
                    <Layer {...layerProp}>
                        <div style={{
                            width: 700,
                            height: (this.props.type === 'single' ? 370 : 400),
                            position: 'relative'
                        }}>
                            <Region {...regionProp}/>
                            {this.buttonFactory()}
                        </div>
                    </Layer>
                </div>
            );
        }
    });
});
