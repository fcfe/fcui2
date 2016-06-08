/**
 * 列表
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2.1
 */
define(function (require) {


    var React = require('react');
    var util = require('./core/util');
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
        propTypes: {
            // base
            skin: React.PropTypes.string,
            className: React.PropTypes.string,
            style: React.PropTypes.object,
            disabled: React.PropTypes.bool,
            // self
            datasource: React.PropTypes.array,
            onClick: React.PropTypes.func,
            itemRenderer: React.PropTypes.func
        },
        // @override
        getDefaultProps: function () {
            return {
                skin: '',
                className: '',
                style: {},
                disabled: false,
                datasource: [],
                onClick: cTools.noop,
                itemRenderer: NormalRenderer
            };
        },
        // @override
        getInitialState: function () {
            return {};
        },
        render: function () {
            return (
                <div {...cTools.containerBaseProps('list', this)}>
                    {listFactory(this)}
                </div>
            );
        }
    });


    function listFactory(me) {
        if (!(me.props.datasource instanceof Array) || !me.props.datasource.length) return null;
        var result = [];
        for (var i = 0; i < me.props.datasource.length; i++) {
            var item = me.props.datasource[i];
            if (item.hr) {
                result.push(<hr key={i}/>);
                continue;
            }
            var prop = JSON.parse(JSON.stringify(item)); //深度克隆
            var Renderer = item.renderer;
            prop.key = prop.hasOwnProperty('key') ? prop.key : i;
            prop.onClick = typeof me.props.onClick === 'function' ? me.props.onClick : cTools.noop;
            prop.disabled = prop.disabled || me.props.disabled;

            Renderer = typeof Renderer === 'function' ? Renderer : me.props.itemRenderer;
            Renderer = typeof Renderer === 'function' ? Renderer : NormalRenderer;

            result.push(<Renderer {...prop} />);
        }
        return result;
    }


});
