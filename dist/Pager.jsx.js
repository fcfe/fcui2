/**
 * 翻页器
 * @author Brian Li, Han Cong
 * @email lbxxlht@163.com
 * @version 0.0.2.3
 */
define(function (require) {

    var React = require('react');
    var InputWidget = require('./mixins/InputWidget');
    var cTools = require('./core/componentTools');
    var factory = require('./factories/pagerFactory.jsx');

    return React.createClass({
        /**
         * @properties
         *
         * @param {Import|Properties} src\core\componentTools.js skin className style disabled
         * @param {Number} min 翻页器最小页数
         * @param {Number} max 翻页器最大页数
         * @param {Boolean} showPageJumper 是否显示跳转输入框，默认不显示
         * @param {Number} threshold 翻页器阈值，显示时，距离value距离超过此值的按钮将被隐藏
         * @param {Import|Properties} src\mixins\InputWidget.js
         *      value onChange name validations customErrorTemplates valueTemplate
         */
        /**
         * @fire Import src\mixins\InputWidget.js XXX onChange
         */
        contextTypes: {
            appSkin: React.PropTypes.string
        },
        // @override
        mixins: [InputWidget],
        // @override
        getDefaultProps: function getDefaultProps() {
            return {
                // base
                skin: '',
                className: '',
                style: {},
                disabled: false,
                // self
                min: 1,
                max: 10,
                showPageJumper: false,
                threshold: Number.POSITIVE_INFINITY,
                // mixin
                valueTemplate: Number.POSITIVE_INFINITY
            };
        },
        // @override
        getInitialState: function getInitialState() {
            return {};
        },
        onButtonClick: function onButtonClick(e) {
            var min = parseInt(this.props.min, 10);
            var max = parseInt(this.props.max, 10);
            var current = parseInt(this.___getValue___(), 10);
            current = isNaN(current) ? min : current;

            var value = e.target.value;
            if (value + '' === current + '' || this.props.disabled) return;

            var v = 1;
            v = value === 'prev' ? current - 1 : value;
            v = v === 'next' ? current + 1 : v;
            v = parseInt(v, 10);
            v = v < min ? min : v;
            v = v > max ? max : v;

            e = { target: this.refs.container };
            e.target.value = v;
            this.___dispatchChange___(e);
        },
        onPagerChange: function onPagerChange(e) {
            this.___dispatchChange___(e);
        },
        render: function render() {
            var containerProp = cTools.containerBaseProps('pager', this);
            return React.createElement(
                'div',
                containerProp,
                factory.buttonFactory(this),
                factory.pageJumperFactory(this)
            );
        }
    });
});