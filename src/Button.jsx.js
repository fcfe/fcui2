/**
 * 按钮
 *
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2.1
 */
define(function (require) {


    var React = require('react');
    var cTools = require('./core/componentTools');


    return React.createClass({

        /**
         * @properties
         * @param {Import|Properties} src\core\componentTools.js skin className style disabled
         * @param {String} label 显示在按钮上的文字。
         * @param {String} title 鼠标悬浮在按钮上时提示的文字。
         * @param {String} icon 按钮上显示的图标，具体见src/css/icon/variable.less。
         * @param {String} type 按钮类型，目前支持：button、submit、reset，如果按钮在Form中，会触发相应事件。
         * @param {String} name 按钮域名，如果组件在表单中，此属性等同于原生dom的name属性。
         * @param {String} value 按钮的值，此属性会通过onClick回调回传。
         * @param {Function} onClick 按钮被点击时触发。
         * @param {Function} onMouseEnter 鼠标滑入按钮时触发。
         * @param {Function} onMouseLeave 鼠标滑出按钮时触发。
         */

        // @override
        propTypes: {
            // base
            skin: React.PropTypes.string,
            className: React.PropTypes.string,
            style: React.PropTypes.object,
            disabled: React.PropTypes.bool,
            // self
            label: React.PropTypes.string,
            title: React.PropTypes.string,
            icon: React.PropTypes.string,
            type: React.PropTypes.string,
            name: React.PropTypes.string,
            value: React.PropTypes.any,
            onClick: React.PropTypes.func,
            onMouseEnter: React.PropTypes.func,
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
