/**
 * 面包屑
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2.1
 */
define(function (require) {


    var React = require('react');
    var cTools = require('./core/componentTools');


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
            return (<div {...containerProp}>{linkFactory(this)}</div>);
        }
    });


    /*
     * 链接工厂，负责生成所有链接和分隔符
     * @param {Object} me 面包屑实例
     * @return {Array.<ReactComponent>}
     */
    function linkFactory(me) {
        var doms = [];
        for (var i = 0; i < me.props.datasource.length; i++) {
            var item = me.props.datasource[i];
            if (!item.hasOwnProperty('href') || me.props.disabled || item.disabled) {
                doms.push(<span key={'n' + i} className="fcui2-crumb-label">{item.label}</span>);
            }
            else {
                doms.push(<a key={'l' + i} href={item.href} target={item.target}>{item.label}</a>);
            }
            if (i < me.props.datasource.length - 1) {
                doms.push(<div key={'s' + i} className="fcui2-crumb-separator">{me.props.separator}</div>);
            }
        }
        return doms;
    }


});
