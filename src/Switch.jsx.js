/**
 * 开关
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2.1
 */
define(function (require) {


    var React = require('react');
    var InputWidget = require('./mixins/InputWidget');
    var cTools = require('./core/componentTools');
    var language = require('./core/language').switch;

    return React.createClass({
        /**
         * @properties
         *
         * @param {Import|Properties} src\core\componentTools.js skin className style disabled
         * @param {Object} labels 话术配置
         * @param {String} labels.on 开启时的话术
         * @param {String} labels.off 关闭时的话术
         * @param {String} value 开关的值，触发onChange时随事件对象返回，用于区分开关的身份
         * @param {Boolean} checked 开关是否开启，触发onChange时随事件对象返回，用于表明开关是否开启
         * @param {Import|Properties} src\mixins\InputWidget.js onChange name validations customErrorTemplates valueTemplate
         */
        /**
         * @fire Switch onChange
         * @param {SyntheticEvent} e React事件对象
         * @param {HtmlElement} e.target 组件实例的根容器
         * @param {String} e.target.value switch的值，'on'或'off'
         */
        // @override
        contextTypes: {
            appSkin: React.PropTypes.string
        },
        // @override
        mixins: [InputWidget],
        // @override
        getDefaultProps: function () {
            return {
                ___uitype___: 'checkbox',
                // base
                skin: '',
                className: '',
                style: {},
                disabled: false,
                // self
                labels: {
                    on: language.on,
                    off: ''
                },
                value: '',
                // mixin
                valueTemplate: false
            };
        },
        // @override
        getInitialState: function () {
            return {};
        },
        onClick: function (e) {
            if (this.props.disabled) return;
            e.target = this.refs.container;
            e.target.value = this.props.value;
            e.target.checked = !e.target.checked;
            this.___dispatchChange___(e);
        },
        render: function () {
            var containerProp = cTools.containerBaseProps('switch', this);
            var label = null;
            var value = this.___getValue___();
            containerProp.checked = (value === 'true' || value === true) ? true : false;
            containerProp.className += ' fcui2-switch-' + (containerProp.checked ? 'on' : 'off');
            label = containerProp.checked && this.props.labels && this.props.labels.on ? this.props.labels.on : null;
            label = !containerProp.checked && this.props.labels && this.props.labels.off ? this.props.labels.off : label;
            return (
                <div {...containerProp} onClick={this.onClick}>
                    <div className="fcui2-switch-label">{label}</div>
                    <div className="fcui2-switch-cursor"></div>
                </div>
            );
        }
    });
});
