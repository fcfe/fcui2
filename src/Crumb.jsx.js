/**
 * 面包屑
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2.1
 */
define(function (require) {

    var React = require('react');
    var cTools = require('./core/componentTools');
    var factory = require('./factories/crumbFactory.jsx');

    return React.createClass({
        /**
         * @properties
         *
         * @param {Import|Properties} src\core\componentTools.js skin className style disabled
         * @param {Array.<CrumbItemObject>} datasource 面包屑数据源
         * @param {String} separator 链接间分隔符
         */
        /**
         * @structure CrumbItemObject
         * @example
         *  {
         *      href: <required>,
         *      label: <required>,
         *      target: <optional>
         *  }
         * @param {String} href 链接地址
         * @param {String} label 链接文字
         * @param {String} target 链接打开方式，同a标签target属性
         */
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
                separator: '>'
            };
        },
        // @override
        getInitialState: function () {
            return {};
        },
        render: function () {
            var containerProp = cTools.containerBaseProps('crumb', this);
            return (<div {...containerProp}>{factory.linkFactory(this)}</div>);
        }
    });

});
