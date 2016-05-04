/**
 * @file 省选择零件
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.1
 */
define(function (require) {


    var React = require('react');
    var MouseWidgetBase = require('../../mixins/MouseWidgetBase');
    var LayerContainerBase = require('../../mixins/LayerContainerBase');
    var CheckBox = require('../../CheckBox.jsx');
    var Radio = require('../../Radio.jsx');

    var tools = require('../../core/regionTools');
    var language = require('../../core/language').region;


    return React.createClass({   
        // @override
        mixins: [MouseWidgetBase, LayerContainerBase],
        // @override
        getDefaultProps: function () {
            return {
                className: '',
                disabled: false,
                id: -1,
                value: {},
                onChange: function () {},
                layerContent: require('./NormalProvinceLayer.jsx'),
                layerProps: {},
                layerInterface: 'onChange',
                type: 'multi'
            };
        },
        // @override
        getInitialState: function () {
            return {
                hover: false
            };
        },
        // @override
        componentDidUpdate: function () {
            if (this.___layer___) {
                this.layerUpdateProp({
                    datasource: tools.filiation[this.props.id],
                    value: this.props.value,
                    type: this.props.type
                });
            }
        },
        layerAction: function (e) {
            if (this.props.disabled) return;
            this.props.onChange(e);
        },
        changeHandler: function (e) {
            if (this.props.disabled) return;
            this.props.onChange(e);
        },
        mouseEnterHandler: function (e) {
            this.___mouseenterHandler___();
            if (this.props.disabled || !tools.filiation[this.props.id] || tools.filiation[this.props.id].length < 1) {
                return;
            }
            this.layerShow({
                datasource: tools.filiation[this.props.id],
                value: this.props.value
            });
        },
        render: function () {
            var containerProp = {
                ref: 'container',
                className: 'fcui2-region-province',
                onMouseLeave: this.___mouseleaveHandler___,
                onMouseEnter: this.mouseEnterHandler
            };
            var selected = tools.getSelectedState(this.props.id, this.props.value);
            var checkboxProp = {
                label: language.regionName[this.props.id],
                labelPosition: 'right',
                disabled: this.props.disabled,
                value: this.props.id,
                checked: selected.checked,
                indeterminate: selected.indeterminate,
                onChange: this.changeHandler
            };
            if (this.state.hover) {
                containerProp.style = {border: '1px solid #C8C8C8'};
            }
            if (this.props.type === 'single') {
                return(
                    <div {...containerProp}>
                        <Radio {...checkboxProp}/>
                    </div>
                );
            }
            else {
            return (
                <div {...containerProp}>
                    <CheckBox {...checkboxProp}/>
                </div>
            );
        }
        }
    });

});
