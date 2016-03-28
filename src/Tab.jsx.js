/**
 * @file 切换组件
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.1
 */
define(function (require) {


    var React = require('react');
    var InputWidgetBase = require('./mixins/InputWidgetBase');
    var NormalRenderer = require('./components/tab/NormalRenderer.jsx');


    return React.createClass({
        // @override
        mixins: [InputWidgetBase],
        // @override
        getDefaultProps: function () {
            return {
                className: '',
                datasource: [], // {label: '', value: ''}
                renderer: NormalRenderer,
                disabled: false,
                valueTemplate: ''
            };
        },
        // @override
        getInitialState: function () {
            return {};
        },
        clickHandler: function (e) {
            if (this.props.disabled) return;
            var value = e.target.value;
            e.target = this.refs.container;
            e.target.value = value;
            this.___dispatchChange___(e);
        },
        render: function () {
            var containerProp = {
                className: 'fcui2-tab ' + this.props.className,
                ref: 'container'
            };
            return (<div {...containerProp}>{produceTabs(this)}</div>);
        }
    });


    function produceTabs(me) {
        if (!(me.props.datasource instanceof Array) || !me.props.datasource.length) return '';
        var doms = [];
        var value = me.___getValue___();
        for (var i = 0; i < me.props.datasource.length; i++) {
            var renderer = typeof me.props.renderer === 'function' ? me.props.renderer : NormalRenderer;
            var props = me.props.datasource[i];
            props.key = i;
            props.onClick = me.clickHandler;
            if (me.props.disabled || props.disabled) {
                props.className = 'fcui2-tab-item-disabled';
            }
            else {
                props.className = 'fcui2-tab-item' + (props.value === value ? '-active' : '');
            }
            doms.push(React.createElement(renderer, props));
        }
        return doms;
    }


});
