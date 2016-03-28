/**
 * @file 选择框组件
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.1
 */
define(function (require) {


    var React = require('react');
    var MouseWidgetBase = require('./mixins/MouseWidgetBase');
    var LayerContainerBase = require('./mixins/LayerContainerBase');
    var InputWidgetBase = require('./mixins/InputWidgetBase');
    var InputWidgetInForm = require('./mixins/InputWidgetInForm');
    

    return React.createClass({
        // @override
        mixins: [MouseWidgetBase, LayerContainerBase, InputWidgetBase, InputWidgetInForm],
        // @override
        getDefaultProps: function () {
            return {
                className: '',
                minWidth: 60,
                width: NaN,
                placeholder: 'please select',
                datasource: [],  // 见List
                disabled: false,
                valueTemplate: '',
                // 以下为LayerContainerBase中需要的配置
                layerContent: require('./List.jsx'),
                layerProps: {},
                layerInterface: 'onClick'
            };
        },
        // @override
        getInitialState: function () {
            return {};
        },
        layerAction: function (e) {
            var value = this.___getValue___();
            if (this.props.disabled || value === e.target.value) return;
            this.___dispatchChange___(e);
            this.layerHide();
        },
        mouseEnterHandler: function (e) {
            this.___mouseenterHandler___();
            if (this.props.datasource.length === 0 || this.props.disabled) return;
            this.layerShow();
        },
        render: function () {
            var me = this;
            var containerProp = {
                className: 'fcui2-dropdownlist ' + this.props.className,
                style: {
                    minWidth: this.props.minWidth,
                    borderColor: this.state.isValid === false ? '#F00' : undefined 
                },
                onMouseEnter: this.mouseEnterHandler,
                onMouseLeave: this.___mouseleaveHandler___,
                ref: 'container'
            };
            if (this.props.disabled) {
                containerProp.className += ' fcui2-dropdownlist-disabled';
            }
            if (!isNaN(this.props.width)) {
                delete containerProp.style.minWidth;
                containerProp.style.width = this.props.width;
            }
            var label = this.props.placeholder;
            var value = this.___getValue___();
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
                </div>
            );
        }
    });
});
