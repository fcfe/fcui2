/**
 * @file 列表组件
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2
 */
define(function (require) {


    var React = require('react');
    var util = require('./core/util');
    var cTools = require('./core/componentTools');
    var NormalRenderer = require('./components/list/NormalRenderer.jsx');


    return React.createClass({
        // @override
        getDefaultProps: function () {
            return {
                skin: '',
                className: '',
                style: {},
                disabled: false,
                datasource: [],  // {label: <string>, value: <string>, disabled: <boolean>, renderer: <function>}
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
