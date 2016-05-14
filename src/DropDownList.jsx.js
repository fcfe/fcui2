/**
 * @file 下拉控制列表组件
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.1
 */
define(function (require) {


    var React = require('react');
    var Layer = require('./Layer.jsx');
    var List = require('./List.jsx');


    return React.createClass({
        // @override
        getDefaultProps: function () {
            return {
                className: '',
                label: 'DropDownList',
                minWidth: 60,
                width: NaN,
                disabled: false,
                datasource: [],
                onClick: function () {}
            };
        },
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
            var containerProp = {
                className: 'fcui2-dropdownlist ' + this.props.className,
                style: {minWidth: this.props.minWidth},
                onMouseEnter: this.mouseEnterHandler,
                onMouseLeave: this.mouseLeaveHandler,
                ref: 'container'
            };
            if (this.props.disabled) {
                containerProp.className += ' fcui2-dropdownlist-disabled';
            }
            if (!isNaN(this.props.width)) {
                delete containerProp.style.minWidth;
                containerProp.style.width = this.props.width;
            }
            var layerProp = {
                ref: 'layer',
                onMouseLeave: this.mouseLeaveHandler,
                isOpen: this.state.layerOpen && !this.props.disabled && this.props.datasource.length,
                anchor: this.refs.container,
                style: {
                    minWidth: '150px'
                }
            };
            var listProp = {
                datasource: this.props.datasource,
                onClick: this.listClickHandler
            };
            return (
                <div {...containerProp}>
                    <div className="icon-right font-icon font-icon-largeable-caret-down"></div>
                    <span>{this.props.label}</span>
                    <Layer {...layerProp}>
                        <List {...listProp} />
                    </Layer>
                </div>
            );
        }
    });
});
