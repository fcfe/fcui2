/**
 * 单选框
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
         * @param {String} label 单选框旁边显示的文字，点击文字也可以改变选中状态
         * @param {String} value 单选框的值，触发onChange时随事件对象返回，用于区分单选框的身份
         * @param {Boolean} checked 单选框是否被选中，触发onChange时随事件对象返回，用于表明单选框时候被选中
         * @param {String} labelPosition 文本标签显示的位置，'right'为单选框右侧，否则在左侧
         * @param {Import|Properties} src\mixins\InputWidget.js
         *      onChange name validations customErrorTemplates valueLink valueTemplate
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
                ___uitype___: 'radio',
                skin: '',
                className: '',
                style: {},
                disabled: false,
                label: '',
                value: '',
                labelPosition: 'right',
                valueTemplate: false
            };
        },
        // @override
        getInitialState: function () {
            return {};
        },
        onLayerClick: function (e) {
            if (this.props.disabled) return;
            e.target = this.refs.inputbox;
            if (!e.target.checked) {
                e.target.checked = !e.target.checked;
                this.___dispatchChange___(e);
            }
        },
        render: function () {
            var containerProp = cTools.containerBaseProps('checkbox', this, {
                style: {position: 'relative'}
            });
            var inputProp = {
                key: 'inputbox',
                ref: 'inputbox',
                type: 'radio',
                name: this.props.name,
                value: this.props.value,
                checked: this.___getValue___(),
                onChange: cTools.noop,
                disabled: this.props.disabled
            };
            var actionLayerProp = {
                key: 'action-layer',
                style: {
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: '100%',
                    height: '100%',
                    cursor: 'pointer'
                },
                onClick: this.onLayerClick
            };
            var doms = [];
            doms.push(<input {...inputProp}/>);
            doms[this.props.labelPosition === 'right' ? 'push' : 'unshift'](
                <span className="fcui2-checkbox-label" key="label">{this.props.label}</span>
            );
            doms.push(<div {...actionLayerProp}></div>);
            return (<div {...containerProp}>{doms}</div>);
        }
    });
});
