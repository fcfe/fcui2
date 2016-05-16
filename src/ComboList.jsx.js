/**
 * @file 组合控制列表组件
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2
 */
define(function (require) {


    var React = require('react');
    var Button = require('./Button.jsx');
    var Layer = require('./Layer.jsx');
    var List = require('./List.jsx');
    var cTools = require('./core/componentTools');


    return React.createClass({
        // @override
        getDefaultProps: function () {
            return {
                skin: '',
                className: '',
                style: {},
                disabled: false,  
                label: 'ComboList',
                icon: '',
                value: '',
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
            var containerProp = cTools.containerBaseProps('combolist', this, {
                merge: {
                    onMouseLeave: this.mouseLeaveHandler
                }
            });
            var mainButtonProp = {
                label: this.props.label,
                disabled: this.props.disabled,
                value: this.props.value,
                icon: this.props.icon,
                skin: 'important',
                className: 'main-button',
                onClick: this.mainButtonClickHandler
            };
            var dropdownButtonProp = {
                className: 'font-icon font-icon-largeable-caret-down',
                onClick: this.dropDownButtonClickHandler
            };
            var layerProp = {
                ref: 'layer',
                isOpen: this.state.layerOpen && this.props.datasource.length && !this.props.disabled,
                anchor: this.refs.container,
                onMouseLeave: this.mouseLeaveHandler,
                style: {
                    minWidth: '150px',
                    maxHeight: '240px',
                    overflow: 'auto'
                }
            };
            var listProp = {
                datasource: this.props.datasource,
                ref: 'list',
                onClick: this.listClickHandler
            };
            return (
                <div {...containerProp}>
                    <div {...dropdownButtonProp}></div>
                    <Button {...mainButtonProp}/>
                    <Layer {...layerProp}>
                        <List {...listProp}/>
                    </Layer>
                </div>
            );
        }
    });
});
