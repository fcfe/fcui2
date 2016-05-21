/**
 * @file 复选框组件
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2
 */
define(function (require) {


    var React = require('react');
    var InputWidget = require('./mixins/InputWidget');
    var cTools = require('./core/componentTools');


    return React.createClass({
        // @override
        mixins: [InputWidget],
        // @override
        getDefaultProps: function () {
            return {
                ___uitype___: 'checkbox',
                skin: '',
                className: '',
                style: {},
                disabled: false,
                label: '',
                value: '',  // checkbox的value用以区分不同的checkbox，其选中状态记录在checked中
                indeterminate: false,
                labelPosition: 'left',
                valueTemplate: false
            };
        },
        // @override
        getInitialState: function () {
            return {};
        },
        // @override
        componentDidMount: function () {
            var value = this.___getValue___();
            this.refs.inputbox.indeterminate = !value && this.props.indeterminate;
        },
        // @override
        componentDidUpdate: function () {
            var value = this.___getValue___();
            this.refs.inputbox.indeterminate = !value && this.props.indeterminate;
        },
        onClick: function (e) {
            if (this.props.disabled) return;
            e.target = this.refs.inputbox;
            e.target.checked = !e.target.checked;
            this.___dispatchChange___(e);
        },
        onChange: function (e) {
            if (this.props.disabled) return;
            this.___dispatchChange___(e);
        },
        render: function () {
            var containerProp = cTools.containerBaseProps('checkbox', this);
            var labelProp = {
                className: 'fcui2-checkbox-label',
                onClick: this.onClick
            };
            var inputProp = {
                ref: 'inputbox',
                type: 'checkbox',
                disabled: this.props.disabled,
                value: this.props.value,
                checked: this.___getValue___(),
                onChange: this.onChange
            };
            var doms = [];
            doms.push(<input {...inputProp} key="input"/>);
            doms[this.props.labelPosition === 'right' ? 'push' : 'unshift'](
                <span {...labelProp} key="label">{this.props.label}</span>
            );
            return (<div {...containerProp}>{doms}</div>);
        }
    });
});
