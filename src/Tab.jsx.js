/**
 * @file 切换组件
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2
 */
define(function (require) {


    var React = require('react');
    var InputWidget = require('./mixins/InputWidget');
    var NormalRenderer = require('./components/tab/NormalRenderer.jsx');
    var cTools = require('./core/componentTools');


    return React.createClass({
        // @override
        mixins: [InputWidget],
        // @override
        getDefaultProps: function () {
            return {
                skin: '',
                className: '',
                style: {},
                disabled: false,
                datasource: [], // {label: '', value: ''}
                renderer: NormalRenderer,
                valueTemplate: ''
            };
        },
        // @override
        getInitialState: function () {
            return {};
        },
        onClick: function (e) {
            if (this.props.disabled || e.target.value === this.___getValue___()) return;
            var value = e.target.value;
            e.target = this.refs.container;
            e.target.value = value;
            this.___dispatchChange___(e);
        },
        render: function () {
            return (
                <div {...cTools.containerBaseProps('tab', this)}>
                    {produceTabs(this)}
                </div>
            );
        }
    });


    function produceTabs(me) {
        if (!(me.props.datasource instanceof Array) || !me.props.datasource.length) return null;
        var doms = [];
        var value = me.___getValue___();
        for (var i = 0; i < me.props.datasource.length; i++) {
            var Renderer = typeof me.props.renderer === 'function' ? me.props.renderer : NormalRenderer;
            var props = me.props.datasource[i];
            props.key = i;
            props.onClick = props.disabled ? undefined : me.onClick;
            if (me.props.disabled || props.disabled) {
                props.className = 'fcui2-tab-item-disabled';
            }
            else {
                props.className = 'fcui2-tab-item' + (props.value === value ? '-active' : '');
            }
            doms.push(<Renderer {...props} />);
        }
        return doms;
    }


});
