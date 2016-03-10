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


    return React.createClass({
        // @override
        mixins: [MouseWidgetBase, LayerContainerBase, InputWidgetBase],
        // @override
        getDefaultProps: function () {
            return {
                className: '',
                minWidth: 60,
                width: NaN,
                placeholder: 'please select',
                datasource: [],  // 见List
                disable: false,
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
            if (this.props.disable || value === e.target.value) return;
            this.___dispatchChange___(e);
            this.layerHide();
        },
        mouseEnterHandler: function (e) {
            this.___mouseenterHandler___();
            if (this.props.datasource.length === 0 || this.props.disable) return;
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
            if (this.props.disable) {
                containerProp.className += ' fcui2-dropdownlist-disable';
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
