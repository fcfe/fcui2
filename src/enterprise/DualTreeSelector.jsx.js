/**
 * 企业级双树选择器
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2.1
 */
define(function (require) {


    var React = require('react');
    var cTools = require('../core/componentTools');
    var Renderer = require('../components/tree/SelectRenderer.jsx');
    var InputWidget = require('../mixins/InputWidget');
    var tools = require('../core/treeTools');


    return React.createClass({
        /**
         * @properties
         * @param {Import|Properties} src\core\componentTools.js skin className style disabled
         * @param {Import|Properties} src\core\DualTreeSelector.jsx.js datasource onAction leafRenderer selectorEngine
         * @param {Import|Properties} src\mixins\InputWidget.js value onChange name validations customErrorTemplates valueLink valueTemplate
         */
        /**
         * @fire Import src\mixins\InputWidget.js XXX onChange
         */
        /**
         * @fire Import src\DualTreeSelector.jsx.js onAction
         */
        /**
         * @structure Import src\Tree.jsx.js TreeItemObject
         */
        /**
         * @structure Import src\DualTreeSelector.jsx.js DualTreeSelectorValueTemplate
         */
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
                onAction: cTools.noop,
                leafRenderer: Renderer,
                selectorEngine: tools.dualTreeSelectorEngine,
                // mixin
                valueTemplate: JSON.stringify({selected: {}})
            };
        },
        // @override
        getInitialState: function () {
            return {
                expand: {}
            }
        },
        render: function () {
            return (
                <div {...cTools.containerBaseProps('dualtreeselector-enterprise', this)}>
                    111
                </div>
            );
        }
    });


});
