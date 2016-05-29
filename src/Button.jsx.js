/**
 * @file 按钮组件
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2
 */
define(function (require) {


    var React = require('react');
    var cTools = require('./core/componentTools');


    return React.createClass({


        // @override
        propTypes: {
            // 组件皮肤
            skin: React.PropTypes.string,
            // 组件拼装到根容器上的class
            className: React.PropTypes.string,
            // 组件拼装到根容器上的style
            style: React.PropTypes.object,
            // 组件是否可用
            disabled: React.PropTypes.bool,
            // 按钮显示的文字
            label: React.PropTypes.string,
            // 按钮的提示，鼠标悬浮一段时间后显示
            title: React.PropTypes.string,
            // 按钮显示的ICON，在label左侧，可以不设置
            icon: React.PropTypes.string,
            // 按钮类型，默认为button，可以为submit或reset，如果按钮在表单中，会触发相应事件
            type: React.PropTypes.string,
            // 按钮域名，如果组件在表单中，此属性等同于原生dom的name属性
            name: React.PropTypes.string,
            // 按钮值，此属性会通过onClick回调回传
            value: React.PropTypes.any,
            // 鼠标点击回调
            onClick: React.PropTypes.func,
            // 鼠标移入回调
            onMouseEnter: React.PropTypes.func,
            // 鼠标移除回调
            onMouseLeave: React.PropTypes.func
        },


        // @override
        getDefaultProps: function () {
            return {
                skin: '',
                className: '',
                style: {},
                disabled: false,
                label: 'Button',
                title: '',
                icon: '',
                type: 'button',
                name: '',
                value: '',
                onClick: cTools.noop,
                onMouseEnter: cTools.noop,
                onMouseLeave: cTools.noop
            };
        },
        // @override
        getInitialState: function () {
            return {
                mousedown: false
            };
        },
        onClick: function (e) {
            if (this.props.disabled) return;
            e.target = this.refs.container;
            e.target.value = this.props.value;
            this.props.onClick(e);
        },
        onMouseDown: function (e) {
            if (this.props.disabled) return;
            this.setState({mousedown: true});
        },
        onMouseUp: function (e) {
            if (this.props.disabled) return;
            this.setState({mousedown: false});
        },
        render: function () {
            var inputProp = {
                type: 'button;submit;reset;'.indexOf(this.props.type + ';') > -1 ? this.props.type : 'button',
                name: this.props.name,
                value: this.props.label,
                disabled: this.props.disabled
            };
            if (this.props.icon.length > 0) {
                 inputProp.style = {textAlign: 'left'};
            }
            var containerProp = cTools.containerBaseProps('button', this, {
                merge: {
                    onMouseDown: this.onMouseDown,
                    onMouseUp: this.onMouseUp,
                    onClick: this.onClick
                },
                mergeFromProps: ['onMouseEnter', 'onMouseLeave', 'value', 'title']
            });
            containerProp.className += this.state.mousedown ? ' fcui2-button-active' : '';
            if (containerProp.style.hasOwnProperty('width') && !isNaN(containerProp.style.width)) {
                containerProp.style.width = containerProp.style.width - 2;
            }
            return (
                <div {...containerProp}>
                    {this.props.icon.length > 0 ? <div className={'font-icon ' + this.props.icon}></div> : null}
                    <input {...inputProp}/>
                </div>
            );
        }
    });
});
