/**
 * 列表
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2.2
 */
define(function (require) {


    var React = require('react');
    var factory = require('./factories/listFactory.jsx');
    var cTools = require('./core/componentTools');
    var NormalRenderer = require('./components/list/NormalRenderer.jsx');


    return React.createClass({
        /**
         * @properties
         * @param {Import|Properties} src\core\componentTools.js skin className style disabled
         * @param {Array.<ListItemObject>} datasource 列表数据源
         * @param {Function} onClick 列表点击后的回调
         * @param {ReactClass} itemRenderer 列表项渲染器
         */
        /**
         * @structure ListItemObject
         * @example
         *  {
         *      label: <required>,
         *      value: <required>,
         *      disabled: <optional>
         *  }
         * @param {String} label 列表项显示的文字
         * @param {String} value 列表项对应的值，随事件对象通过返回
         * @param {Boolean} disabled 列表项是否可用
         */
        // @override
        contextTypes: {
            appSkin: React.PropTypes.string
        },
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
                onClick: cTools.noop,
                onMouseOver: cTools.noop,
                itemRenderer: NormalRenderer
            };
        },
        // @override
        getInitialState: function () {
            return {};
        },
        render: function () {
            return (
                <div {...cTools.containerBaseProps('list', this, {widthCorrect: -2})}>
                    {factory.listFactory(this)}
                </div>
            );
        }
    });

});
