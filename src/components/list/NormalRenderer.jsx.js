/**
 * @file List组件item渲染器
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2
 */
define(function (require) {


    var React = require('react');


    return React.createClass({
        // @override
        getDefaultProps: function () {
            // 此处为List.props.datasource[i]
            return {
                label: '',
                value: '',
                disabled: false, 
                onClick: function () {}
            };
        },
        // @override
        getInitialState: function () {
            return {};
        },
        onClick: function (e) {
            if (this.props.disabled) return;
            e.target = this.refs.container;
            e.target.value = this.props.value
            this.props.onClick(e);
        },
        render: function () {
            var containerProp = {
                ref: 'container',
                className: 'list-normal-item' + (this.props.disabled ? ' list-normal-item-disabled' : ''),
                onClick: this.onClick
            };
            return (
                <div {...containerProp}>
                    <span>{this.props.label}</span>
                </div>
            );
        }
    });

});
