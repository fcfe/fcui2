/**
 * @file 面包屑组件
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.1
 */
define(function (require) {


    var React = require('react');


    return React.createClass({
        // @override
        getDefaultProps: function () {
            return {
                className: '',
                datasource: [], // {href: '', label: '', target: ''}
                separator: '>',
                disabled: false
            };
        },
        // @override
        getInitialState: function () {
            return {};
        },
        render: function () {
            var containerProp = {
                className: 'fcui2-crumb ' + this.props.className,
                ref: 'container'
            };
            return (<div {...containerProp}>{linkFactory(this)}</div>);
        }
    });


    function linkFactory(me) {
        var doms = [];
        for (var i = 0; i < me.props.datasource.length; i++) {
            var item = me.props.datasource[i];
            if (!item.hasOwnProperty('href') || me.props.disabled || item.disabled) {
                doms.push(<span key={'n' + i} className="fcui2-crumb-label">item.label</span>);
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
