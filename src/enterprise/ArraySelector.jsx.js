/**
 * 企业级数组选择器
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2.1
 */
define(function (require) {


    var _ = require('underscore');
    var React = require('react');
    var Button = require('../Button.jsx');
    var Layer = require('../Layer.jsx');
    var Tip = require('../Tip.jsx');
    var InputWidget = require('../mixins/InputWidget');
    var cTools = require('../core/componentTools');
    var util = require('../core/util');
    var language = require('../core/language').arraySelector;
    var defaultLabels = {
        dropdownLabel: 'please select',
        selectedLabel: 'Selected Items',
        unselectedLabel: 'Unselected Items',
        tipContent: 'tipContent'
    };


    return React.createClass({
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
                clearTemporaryAfterLayerClose: true,
                isDropDown: false,
                labels: defaultLabels,
                onBeforeLayerClose: cTools.noop,
                onLayerClose: cTools.noop,
                // mixin
                valueTemplate: JSON.stringify({
                    selected: [],
                    unselected: []
                })
            };
        },
        // @override
        getInitialState: function () {
            return {
                layerOpen: false,
                dropdownValue: this.___getValue___()
            };
        },
        // @override
        componentWillReceiveProps: function (nextProps) {
            if (
                nextProps.isDropDown
                && !_.isEqual(
                    JSON.parse(nextProps.value || '{}'),
                    JSON.parse(this.state && this.state.dropdownValue ? this.state.dropdownValue : '{}')
                )
                && this.state 
                && !this.state.___beOperated___
            ) {
                this.setState({dropdownValue: nextProps.value});
            }
        },
        onLayerEnter: function (e) {
            e.target.value = this.state.dropdownValue;
            this.___dispatchChange___(e);
            var tmpValue = this.state.dropdownValue;
            if (this.props.clearTemporaryAfterLayerClose) {
                tmpValue = this.props.value ? this.props.value : '';
            }
            this.setState({___beOperated___: false});
            e = {};
            this.onBeforeLayerClose(e);
            if (e.returnValue) {
                typeof this.props.onLayerClose === 'function' && this.props.onLayerClose();
                this.setState({
                    layerOpen: false,
                    dropdownValue: tmpValue
                });
            }
        },
        onLayerClose: function (e) {
            var tmpValue = this.state.dropdownValue;
            var beOperated = this.state.___beOperated___;
            if (this.props.clearTemporaryAfterLayerClose) {
                tmpValue = this.props.value ? this.props.value : '';
                beOperated = false;
            }
            typeof this.props.onLayerClose === 'function' && this.props.onLayerClose();
            this.setState({
                layerOpen: false,
                dropdownValue: tmpValue,
                ___beOperated___: beOperated
            });
        },
        onBeforeLayerClose: function (e) {
            e.returnValue = true;
            typeof this.props.onBeforeLayerClose === 'function' && this.props.onBeforeLayerClose(e);
        },
        render: function () {
            if (!this.props.isDropDown) return mainContentFactory(this);
            var containerProp = cTools.containerBaseProps('dropdownlist', this, {
                merge: {
                    onClick: cTools.openLayerHandlerFactory(this, 'layerOpen')
                },
                widthCorrect: -12
            });
            var labels = _.extend({}, defaultLabels, this.props.labels);
            var layerProp = {
                ref: 'layer',
                style: {
                    width: '590px'
                },
                isOpen: this.state.layerOpen,
                anchor: this.refs.dropdownContainer,
                location: 'bottom',
                closeWithBodyClick: true,
                onCloseByWindow: this.onLayerClose
            };
            var enterButtonProp = {
                disabled: !this.state.___beOperated___,
                label: language.enter,
                skin: 'important',
                onClick: this.onLayerEnter
            };
            containerProp.ref = 'dropdownContainer';
            containerProp.className += layerProp.isOpen ? ' fcui2-dropdownlist-hover' : '';
            return (
                <div {...containerProp}>
                    <div className="icon-right font-icon font-icon-largeable-caret-down"></div>
                    <span className="label-container">{labels.dropdownLabel ? labels.dropdownLabel : ''}</span>
                    <Layer {...layerProp}>
                        <div style={{padding: 10}}>
                            {mainContentFactory(this)}
                            <Button {...enterButtonProp}/>
                            <Button label={language.cancel} onClick={this.onLayerClose} style={{marginLeft: 10}}/>
                        </div>
                    </Layer>
                </div>
            );
        }
    });


    function mainContentFactory(me) {
        var value = me.props.isDropDown ? me.state.dropdownValue : me.___getValue___();
        var labels = _.extend({}, defaultLabels, me.props.labels);
        var containerProp = me.props.isDropDown ? {
                ref: 'container',
                className: 'fcui2-arrayselector-enterprise fcui2-arrayselector-enterprise-'
                    + (me.props.skin ? me.props.skin : 'normal')
            } : cTools.containerBaseProps('arrayselector-enterprise', me);
        try {
            value = JSON.parse(value);
        }
        catch(e) {
            value = {};
        }
        value.selected = value.selected instanceof Array ? value.selected : [];
        value.unselected = value.unselected instanceof Array ? value.unselected : [];
        return (
            <div {...containerProp}>
                <div className="shortcut-bar">
                    <Tip content={labels.tipContent} layerLocation="left bottom"/>
                    <span>{language.default}</span>
                    {' | '}
                    <span>{language.addAll}</span>
                </div>
                <div className="selected-option-title">
                    {labels.selectedLabel}
                    <span className="selected-option-title-info">
                        {'(' + language.click}
                        <span className="font-icon font-icon-times"></span>
                        {language.delete + ')'}
                    </span>
                </div>
                <div className="selected-option-container">
                    {selectedFactory(value.selected, me)}
                </div>
                <div className="unselected-option-title">
                    {labels.unselectedLabel}
                    <span className="selected-option-title-info">
                        {'(' + language.click}
                        <span className="font-icon font-icon-plus"></span>
                        {language.add + ')'}
                    </span>
                </div>
                <div className="unselected-option-container">
                    {unselectedFactory(value.unselected, me)}
                </div>
            </div>
        );
    }


    function selectedFactory(arr, me) {
        var doms = [];
        for (var i = 0; i < arr.length; i++) {
            var leftIcon = 'font-icon font-icon-largeable-arrow-left'
                + (i === 0 ? ' font-icon-disabled' : '');
            var rightIcon = 'font-icon font-icon-largeable-arrow-right'
                + (i === arr.length - 1 ? ' font-icon-disabled' : '');
            doms.push(
                <div key={'selected-' + i} className="selected-option">
                    <span className="option-index-label">{i + 1}</span>
                    <span className="option-label">{arr[i].label}</span>
                    <span className={leftIcon}></span>
                    <span className={rightIcon}></span>
                    <span className="font-icon font-icon-times"></span>
                </div>
            );
        }
        return doms;
    }


    function unselectedFactory(arr, me) {
        var doms = [];
        for (var i = 0; i < arr.length; i++) {
            doms.push(
                <div key={'unselected-' + i} className="selected-option">
                    <span className="option-label">{arr[i].label}</span>
                    <span className="font-icon font-icon-plus"></span>
                </div>
            );
        }
        return doms;
    }

});
