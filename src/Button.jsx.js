/**
 * @file 按钮组件
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.1
 */
define(function (require) {

    var React = require('react');
    var MouseWidgetBase = require('./mixins/MouseWidgetBase');

    return React.createClass({
        // @override
        mixins: [MouseWidgetBase],
        // @override
        getDefaultProps: function () {
            return {
                className: '',
                minWidth: 40,
                width: null,
                type: 'button', // 用于form：button, submit, reset
                name: '',       // 用于form
                label: 'Button',
                icon: '',
                value: '',
                skin: '',
                disable: false,
                onClick: function () {}
            };
        },
        // @override
        getInitialState: function () {
            return {};
        },
        clickHandler: function (e) {
            if (this.props.disable) return;
            this.props.onClick({
                target: this,
                value: this.props.value
            });
            e.stopPropagation();
        },
        render: function () {
            var dom = [];
            var containerProp = {
                className: 'fcui2-button ' + this.props.className,
                style: {minWidth: this.props.minWidth},
                onMouseDown: this.___mousedownHandler___,
                onMouseUp: this.___mouseupHandler___,
                onClick: this.clickHandler
            };
            var inputProp = {
                type: 'button;submit;reset;'.indexOf(this.props.type + ';') > -1 ? this.props.type : 'button',
                name: this.props.name,
                value: this.props.label,
                key: 'button' 
            };
            if (this.props.disable) {
                containerProp.className += ' fcui2-button-disable';
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
