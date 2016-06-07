/**
 * 向导
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2.1
 */
define(function (require) {


    var React = require('react');
    var InputWidget = require('./mixins/InputWidget');
    var util = require('./core/util');
    var cTools = require('./core/componentTools');


    return React.createClass({
        /**
         * @properties
         *
         * @param {Import|Properties} src\core\componentTools.js skin className style disabled
         * @param {Array.<String>} datasource 向导标签文字列表
         * @param {Import|Properties} src\mixins\InputWidget.js
         *      value onChange name validations customErrorTemplates valueLink valueTemplate
         */
        // @override
        propTypes: {
            // base
            skin: React.PropTypes.string,
            className: React.PropTypes.string,
            style: React.PropTypes.object,
            disabled: React.PropTypes.bool,
            // self
            datasource: React.PropTypes.array,
            // mixin
            value: React.PropTypes.number,
            valueLink: React.PropTypes.object,
            name: React.PropTypes.string,
            onChange: React.PropTypes.func,
            validations: React.PropTypes.object,
            customErrorTemplates: React.PropTypes.object,
            valueTemplate: React.PropTypes.number
        },
        // @override
        mixins: [InputWidget],
        // @override
        getDefaultProps: function () {
            return {
                skin: '',
                className: '',
                style: {},
                disabled: false,
                datasource: [],
                valueTemplate: 0
            };
        },
        // @override
        getInitialState: function () {
            return {};
        },
        onClick: function (e) {
            if (this.props.disabled) return;
            var value = util.getDataset(e.target).uiCmd;
            if (isNaN(value)) return;
            e.target = this.refs.container;
            e.target.value = value;
            this.___dispatchChange___(e);
        },
        render: function () {
            return (<div {...cTools.containerBaseProps('wizard', this)}>{produceItems(this)}</div>);
        }
    });


    function produceItems(me) {
        if (!(me.props.datasource instanceof Array) || !me.props.datasource.length) return '';
        var doms = [];
        var value = me.___getValue___();
        value = isNaN(value) ? 0 : value * 1;
        for (var i = 0; i < me.props.datasource.length; i++) {
            var props = {
                key: i,
                className: 'fcui2-wizard-item',
                onClick: me.onClick,
                'data-ui-cmd': i,
                style: {
                    width: parseFloat(100 / me.props.datasource.length).toFixed(2) + '%',
                    zIndex: me.props.datasource.length - i
                }
            };
            if (me.props.disabled) {
                props.className += ' fcui2-wizard-item-disabled';
            }
            else if (i < value + 1) {
                props.className += ' fcui2-wizard-item-active';
            }
            else {
                props.className += ' fcui2-wizard-item-normal';
            }
            doms.push(
                <div {...props}>
                    <span data-ui-cmd={i}>{me.props.datasource[i]}</span>
                    <div data-ui-cmd={i} className="fcui2-wizard-arrow-bg"></div>
                    <div data-ui-cmd={i} className="fcui2-wizard-arrow"></div>
                </div>
            );
        }
        return doms;
    }


});
