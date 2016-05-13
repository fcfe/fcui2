/**
 * @file 组合控制列表组件
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.1
 */
define(function (require) {


    var React = require('react');
    var Button = require('./Button.jsx');
    var Layer = require('./Layer.jsx');
    var List = require('./List.jsx');


    return React.createClass({
        // @override
        getDefaultProps: function () {
            return {
                className: '',
                label: 'ComboList',
                icon: '',
                value: '',
                disabled: false,
                datasource: [], // 见List
                onClick: function () {}
            };
        },
        // @override
        getInitialState: function () {
            return {
                layerOpen: false
            };
        },
        listClickHandler: function (e) {
            if (this.props.disabled) return;
            this.props.onClick(e);
            this.setState({layerOpen: false});  
        },
        mainButtonClickHandler: function (e) {
            if (this.props.disabled) return;
            this.props.onClick(e);
            this.setState({layerOpen: false});
        },
        dropDownButtonClickHandler: function (e) {
            this.setState({layerOpen: true});
        },
        mouseLeaveHandler: function (e) {
            var me = this;
            // 延迟关闭
            setTimeout(function () {
                if (me.refs.layer && me.refs.layer.state.mouseenter) return;
                me.setState({layerOpen: false});
            }, 200);
        },
        render: function () {
            var me = this;
            var containerProp = {
                className: 'fcui2-combolist ' + this.props.className
                    + (this.props.disabled ? ' fcui2-combolist-disabled' : ''),
                onMouseLeave: this.mouseLeaveHandler,
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
            var layerProp = {
                ref: 'layer',
                isOpen: this.state.layerOpen && this.props.datasource.length && !this.props.disabled,
                anchor: this.refs.container,
                onMouseLeave: this.mouseLeaveHandler
            };
            var listProp = {
                datasource: this.props.datasource,
                ref: 'list',
                onClick: this.listClickHandler
            };
            return (
                <div {...containerProp}>
                    <div className="font-icon font-icon-largeable-caret-down" onClick={this.dropDownButtonClickHandler}></div>
                    <Button {...mainButtonProp}/>
                    <Layer {...layerProp}>
                        <List {...listProp}/>
                    </Layer>
                </div>
            );
        }
    });
});
