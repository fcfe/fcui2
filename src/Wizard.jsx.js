/**
 * 向导
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2.2
 */
define(function (require) {


    var React = require('react');
    var InputWidget = require('./mixins/InputWidget');
    var util = require('./core/util');
    var cTools = require('./core/componentTools');
    var factory = require('./factories/wizardFactory.jsx');


    return React.createClass({
        /**
         * @properties
         *
         * @param {Import|Properties} src\core\componentTools.js skin className style disabled
         * @param {Array.<String>} datasource 向导标签文字列表
         * @param {Import|Properties} src\mixins\InputWidget.js
         *      value onChange name validations customErrorTemplates valueTemplate
         */
        /**
         * @fire Import src\mixins\InputWidget.js XXX onChange
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
                // base
                skin: '',
                className: '',
                style: {},
                disabled: false,
                // self
                datasource: [],
                // mixin
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
            e = {target: this.refs.container};
            e.target.value = value;
            this.___dispatchChange___(e);
        },
        render: function () {
            return (<div {...cTools.containerBaseProps('wizard', this)}>{factory.produceItems(this)}</div>);
        }
    });

});
