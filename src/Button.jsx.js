/**
 * @file 按钮组件
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2
 */
define(function (require) {


    var React = require('react');
    var MouseWidgetBase = require('./mixins/MouseWidgetBase');


    return React.createClass({

        // @override
        propTypes: {
            // 组件拼装到根容器上的class
            className: React.PropTypes.string,
            // 组件拼装到根容器上的style
            style: React.PropTypes.object,
            // 组件皮肤，如果disabled属性为true，此属性无效
            skin: React.PropTypes.string,
            // 组件是否可用，如果设置为true，skin属性无效
            disabled: React.PropTypes.bool,
            // 按钮最小宽度
            minWidth: React.PropTypes.number,
            // 按钮固定宽度，默认为NaN，即没有固定限制；若指定，minWidth属性无效
            width: React.PropTypes.any,
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
            /**
             * 点击按钮时的回调
             * @param {SyntheticEvent} e 点击事件对象
             * @param {HtmlElement} e.target 按钮的根容器
             * @param {string} e.target.value 按钮的value属性
             */
            onClick: React.PropTypes.func
        },

        // @override
        mixins: [MouseWidgetBase],

        // @override
        getDefaultProps: function () {
            return {
                className: '',
                style: {},
                skin: '',
                disabled: false,
                minWidth: 40,
                width: NaN,
                label: 'Button',
                title: '',
                icon: '',
                type: 'button',
                name: '',
                value: '',
                onClick: function () {}
            };
        },
        // @override
        getInitialState: function () {
            return {};
        },
        clickHandler: function (e) {
            if (this.props.disabled) return;
            e.target = this.refs.container;
            e.target.value = this.props.value;
            this.props.onClick(e);
            e.stopPropagation();
        },
        render: function () {
            var dom = [];
            var containerProp = {
                className: 'fcui2-button ' + this.props.className,
                title: this.props.title,
                style: {minWidth: this.props.minWidth},
                onMouseDown: this.___mousedownHandler___,
                onMouseEnter: this.___mouseenterHandler___,
                onMouseLeave: this.___mouseleaveHandler___,
                onMouseUp: this.___mouseupHandler___,
                onClick: this.clickHandler,
                ref: 'container'
            };
            var inputProp = {
                type: 'button;submit;reset;'.indexOf(this.props.type + ';') > -1 ? this.props.type : 'button',
                name: this.props.name,
                value: this.props.label,
                key: 'button' 
            };
            for (var key in this.props.style) {
                if (!this.props.style.hasOwnProperty(key)) continue;
                containerProp.style[key] = this.props.style[key];
            }
            if (this.props.disabled) {
                containerProp.className += ' fcui2-button-disabled';
            }
            else {
                if (this.state.mousedown) {
                    containerProp.className += ' fcui2-button-active';
                }
                if (this.props.skin.length > 0) {
                    containerProp.className += ' fcui2-button-' + this.props.skin;
                }
            }
            if (!isNaN(this.props.width)) {
                delete containerProp.style.minWidth;
                containerProp.style.width = this.props.width;
            }
            if (this.props.icon.length > 0) {
                inputProp.style = {textAlign: 'left'};
                dom.push(<div className={'font-icon ' + this.props.icon} key="icon"/>);
            }
            dom.push(<input {...inputProp}/>);
            return <div {...containerProp}>{dom}</div>;
        }
    });
});
