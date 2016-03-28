/**
 * @file 搜索框组件
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.1
 */
define(function (require) {


    var React = require('react');
    var InputWidgetBase = require('./mixins/InputWidgetBase');
    var TextBox = require('./TextBox.jsx');


    return React.createClass({
        // @override
        mixins: [InputWidgetBase],
        // @override
        getDefaultProps: function () {
            return {
                className: '',
                width: 200,
                placeholder: '',
                disabled: false,
                valueTemplate: '',
                onClick: function () {}
            };
        },
        // @override
        getInitialState: function () {
            return {};
        },
        changeHandler: function (e) {
            if (this.props.disabled) return;
            this.___dispatchChange___(e);
        },
        clickHandler: function (e) {
            e.target = this.refs.container;
            e.target.value = this.___getValue___();
            this.props.onClick(e);
        },
        focus: function () {
            this.refs.inputbox.focus();
        },
        render: function () {
            var containerProp = {
                ref: 'container',
                className: 'fcui2-searchbox ' + this.props.className,
                style: {width: this.props.width}
            };
            var inputProp = {
                value: this.___getValue___(),
                width: this.props.width - 16,
                placeholder: this.props.placeholder,
                disabled: this.props.disabled,
                ref: 'inputbox',
                onChange: this.changeHandler
            };
            if (this.props.disabled) {
                containerProp.className += ' fcui2-searchbox-disabled';
            }
            return (
                <div {...containerProp}>
                    <TextBox {...inputProp}/>
                    <div className="font-icon font-icon-search" onClick={this.clickHandler}></div>
                </div>
            );
        }
    });
});
