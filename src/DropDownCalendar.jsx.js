/**
 * @file 日期选择框组件
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2
 */
define(function (require) {


    var React = require('react');
    var InputWidget = require('./mixins/InputWidget');
    var Layer = require('./Layer.jsx');
    var Calendar = require('./Calendar.jsx');
    var cTools = require('./core/componentTools');



    return React.createClass({
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
                min: '0-1-1',
                max: '9999-12-31',
                valueTemplate: ''
            };
        },
        // @override
        getInitialState: function () {
            return {
                layerOpen: false
            };
        },
        onChange: function (e) {
            var value = this.___getValue___();
            if (this.props.disabled || value === e.target.value) return;
            this.___dispatchChange___(e);
            this.setState({layerOpen: false});
        },
        render: function () {
            var me = this;
            var containerProp = cTools.containerBaseProps('dropdownlist', this, {
                merge: {
                    onMouseEnter: cTools.openLayerHandler.bind(this),
                    onMouseLeave: cTools.closeLayerHandler.bind(this)
                }
            });
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
