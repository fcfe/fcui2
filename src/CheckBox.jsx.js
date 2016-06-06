/**
 * 复选框
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2.1
 */
define(function (require) {


    var React = require('react');
    var InputWidget = require('./mixins/InputWidget');
    var cTools = require('./core/componentTools');


    return React.createClass({
        /**
         * @properties
         *
         * @param {Import|Properties} src\core\componentTools.js skin className style disabled
         * @param {String} label 复选框旁边显示的文字，点击文字也可以改变选中状态。
         * @param {String} value 复选框的值，触发onChange时随事件对象返回，用于区分复选框的身份。
         * @param {Boolean} checked 复选框是否被选中，触发onChange时随事件对象返回，用于表明复选框时候被选中。
         * @param {Boolean} indeterminate 复选框时候处于半选状态，如果checked为false、indeterminate为true，复选框将呈现
         *      为半选状态。
         * @param {String} labelPosition 文本标签显示的位置，'right'为复选框右侧，否则在左侧。
         * @param {Import|Properties} src\mixins\InputWidget.js
         *      onChange name validations customErrorTemplates valueLink
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
            value: React.PropTypes.string,
            checked: React.PropTypes.bool,
            indeterminate: React.PropTypes.bool,
            labelPosition: React.PropTypes.string,
            // mixin
            valueLink: React.PropTypes.object,
            name: React.PropTypes.string,
            onChange: React.PropTypes.func,
            validations: React.PropTypes.object,
            customErrorTemplates: React.PropTypes.object,
            valueTemplate: React.PropTypes.string
        },
        // @override
        mixins: [InputWidget],
        // @override
        getDefaultProps: function () {
            return {
                ___uitype___: 'checkbox',
                skin: '',
                className: '',
                style: {},
                disabled: false,
                label: '',
                value: '',
                indeterminate: false,
                labelPosition: 'right',
                valueTemplate: false
            };
        },
        // @override
        getInitialState: function () {
            return {};
        },
        // @override
        componentDidMount: function () {
            var value = this.___getValue___();
            this.refs.inputbox.indeterminate = !value && this.props.indeterminate;
        },
        // @override
        componentDidUpdate: function () {
            var value = this.___getValue___();
            this.refs.inputbox.indeterminate = !value && this.props.indeterminate;
        },
        // 复选框label文字点击后触发
        onClick: function (e) {
            if (this.props.disabled) return;
            e.target = this.refs.inputbox;
            e.target.checked = !e.target.checked;
            this.___dispatchChange___(e);
        },
        // 复选框点击后触发
        onChange: function (e) {
            if (this.props.disabled) return;
            this.___dispatchChange___(e);
        },
        render: function () {
            var containerProp = cTools.containerBaseProps('checkbox', this);
            var labelProp = {
                className: 'fcui2-checkbox-label',
                onClick: this.onClick
            };
            var inputProp = {
                ref: 'inputbox',
                type: 'checkbox',
                disabled: this.props.disabled,
                value: this.props.value,
                checked: this.___getValue___(),
                onChange: this.onChange
            };
            var doms = [];
            doms.push(<input {...inputProp} key="input"/>);
            doms[this.props.labelPosition === 'right' ? 'push' : 'unshift'](
                <span {...labelProp} key="label">{this.props.label}</span>
            );
            return (<div {...containerProp}>{doms}</div>);
        }
    });
});
