/**
 * 按钮
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2.2
 */
define(function (require) {


    var React = require('react');
    var cTools = require('./core/componentTools');


    return React.createClass({
        /**
         * @properties
         * @param {Import|Properties} src\core\componentTools.js skin className style disabled
         * @param {String} label 显示在按钮上的文字
         * @param {String} title 鼠标悬浮在按钮上时提示的文字
         * @param {String} icon 按钮上显示的图标，具体见src/css/icon/variable.less
         * @param {Number} iconLeft 按钮icon距按钮左边框的距离
         * @param {String} type 按钮类型，目前支持：button、submit、reset，如果按钮在Form中，会触发相应事件
         * @param {String} name 按钮域名，如果组件在表单中，此属性等同于原生dom的name属性
         * @param {String} value 按钮的值，此属性会通过onClick回调回传
         * @param {Function} onClick 按钮被点击时触发
         * @param {Function} onMouseEnter 鼠标滑入按钮时触发
         * @param {Function} onMouseLeave 鼠标滑出按钮时触发
         */
        /**
         * @fire button onClick
         * @param {SyntheticEvent} e React事件对象
         * @param {HtmlElement} e.target 组件实例的根容器
         * @param {String} e.target.value 组件实例的value属性
         */
        /**
         * @fire button onMouseEnter
         * @param {SyntheticEvent} e React事件对象
         * @param {HtmlElement} e.target Button实例的根容器
         */
        /**
         * @fire button onMouseLeave
         * @param {SyntheticEvent} e React事件对象
         * @param {HtmlElement} e.target Button实例的根容器
         */
        contextTypes: {
            appSkin: React.PropTypes.string
        },
        // @override
        getDefaultProps: function () {
            return {
                // base
                skin: '',
                className: '',
                style: {},
                disabled: false,
                // self
                label: 'Button',
                title: '',
                icon: '',
                iconLeft: 10,
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
            e = {target: this.refs.container};
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
            var containerProp = cTools.containerBaseProps('button', this, {
                merge: {
                    onMouseDown: this.onMouseDown,
                    onMouseUp: this.onMouseUp,
                    onClick: this.onClick
                },
                mergeFromProps: ['onMouseEnter', 'onMouseLeave', 'value', 'title'],
                widthCorrect: -2
            });
            var iconProps = {
                className: 'is-icon font-icon ' + this.props.icon,
                style: {
                    left: this.props.iconLeft
                }
            };
            if (this.props.icon.length > 0) {
                 inputProp.style = {textAlign: 'left'};
            }
            return (
                <div {...containerProp}>
                    {this.props.icon.length > 0 ? <div {...iconProps}></div> : null}
                    <input {...inputProp}/>
                </div>
            );
        }
    });
});
