/**
 * @file 选择框组件
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.1
 */
define(function (require) {


    var React = require('react');
    var InputWidgetBase = require('./mixins/InputWidgetBase');
    var InputWidgetInForm = require('./mixins/InputWidgetInForm');
    var Layer = require('./Layer.jsx');
    var List = require('./List.jsx');


    return React.createClass({
        // @override
        mixins: [InputWidgetBase, InputWidgetInForm],
        // @override
        getDefaultProps: function () {
            return {
                className: '',
                minWidth: 60,
                width: NaN,
                placeholder: 'please select',
                datasource: [],  // 见List
                disabled: false,
                valueTemplate: ''
            };
        },
        // @override
        getInitialState: function () {
            return {
                layerOpen: false
            };
        },
        listClickHandler: function (e) {
            var value = this.___getValue___();
            if (this.props.disabled || value === e.target.value) return;
            this.___dispatchChange___(e);
            this.setState({layerOpen: false});
        },
        mouseEnterHandler: function (e) {
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
            var label = this.props.placeholder;
            var value = this.___getValue___();
            var containerProp = {
                className: 'fcui2-dropdownlist ' + this.props.className
                    + (this.props.disabled ? ' fcui2-dropdownlist-disabled' : ''),
                style: {
                    minWidth: this.props.minWidth,
                    borderColor: this.state.isValid === false ? '#F00' : undefined 
                },
                onMouseEnter: this.mouseEnterHandler,
                onMouseLeave: this.mouseLeaveHandler,
                ref: 'container'
            };
            var layerProp = {
                ref: 'layer',
                isOpen: this.state.layerOpen && this.props.datasource.length,
                anchor: this.refs.container,
                onMouseLeave: this.mouseLeaveHandler
            };
            var listProp = {
                datasource: this.props.datasource,
                ref: 'list',
                onClick: this.listClickHandler
            };
            if (!isNaN(this.props.width)) {
                delete containerProp.style.minWidth;
                containerProp.style.width = this.props.width;
            }
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
                    <Layer {...layerProp}>
                        <List {...listProp}/>
                    </Layer>
                </div>
            );
        }
    });
});
