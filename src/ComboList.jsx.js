/**
 * @file 组合控制列表组件
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.1
 */
define(function (require) {


    var React = require('react');
    var Button = require('./Button.jsx');
    var MouseWidgetBase = require('./mixins/MouseWidgetBase');
    var LayerContainerBase = require('./mixins/LayerContainerBase');


    return React.createClass({
        // @override
        mixins: [MouseWidgetBase, LayerContainerBase],
        // @override
        getDefaultProps: function () {
            return {
                className: '',
                label: 'ComboList',
                icon: '',
                value: '',
                disabled: false,
                datasource: [], // 见List
                onClick: function () {},
                // 以下为LayerContainerBase中需要的配置
                layerContent: require('./List.jsx'),
                layerProps: {},
                layerInterface: 'onClick'
            };
        },
        layerAction: function (e) {
            if (this.props.disabled) return;
            this.props.onClick(e);
            this.layerHide();
            e.stopPropagation();
        },
        mainButtonClickHandler: function (e) {
            if (this.props.disabled) return;
            this.props.onClick(e);
            e.stopPropagation();
            this.layerHide();
        },
        dropDownButtonClickHandler: function (e) {
            if (this.props.disabled || this.props.datasource.length === 0) return;
            this.layerShow();
        },
        render: function () {
            var me = this;
            var containerProp = {
                className: 'fcui2-combolist ' + this.props.className,
                onMouseEnter: this.___mouseenterHandler___,
                onMouseLeave: this.___mouseleaveHandler___,
                ref: 'container'
            };
            var mainButtonProp = {
                label: this.props.label,
                disabled: this.props.disabled,
                value: this.props.value,
                icon: this.props.icon,
                skin: 'important',
                className: 'main-button',
                onClick: this.mainButtonClickHandler
            };
            if (this.props.disabled) {
                containerProp.className += ' fcui2-combolist-disabled';
            }
            return (
                <div {...containerProp}>
                    <div className="font-icon font-icon-largeable-caret-down" onClick={this.dropDownButtonClickHandler}></div>
                    <Button {...mainButtonProp}/>
                </div>
            );
        }
    });
});
