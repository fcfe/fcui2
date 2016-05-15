/**
 * @file 复选框组件
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.1
 */
define(function (require) {


    var React = require('react');
    var InputWidget = require('./mixins/InputWidget');
    


    return React.createClass({
        // @override
        mixins: [InputWidget],
        // @override
        getDefaultProps: function () {
            return {
                ___uitype___: 'checkbox',
                className: '',
                style: {},
                label: '',
                value: '',  // checkbox的value存在checked属性中，value中存的东西意义等同于radio的value
                indeterminate: false,
                labelPosition: 'left',
                disabled: false,
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
        clickHandler: function (e) {
            if (this.props.disabled) return;
            e.target = this.refs.inputbox;
            e.target.checked = !e.target.checked;
            this.___dispatchChange___(e);
        },
        changeHandler: function (e) {
            if (this.props.disabled) return;
            this.___dispatchChange___(e);
        },
        render: function () {
            var containerProp = {
                className: 'fcui2-checkbox ' + this.props.className,
                style: {}
            };
            var labelProp = {
                className: 'fcui2-checkbox-label',
                onClick: this.clickHandler
            };
            var inputProp = {
                type: 'checkbox',
                value: this.props.value,
                checked: this.___getValue___(),
                onChange: this.changeHandler
            };
            for (var key in this.props.style) {
                if (!this.props.style.hasOwnProperty(key)) continue;
                containerProp.style[key] = this.props.style[key];
            }
            if (this.props.disabled) {
                containerProp.className += ' fcui2-checkbox-disabled';
            }
            else if (this.state.isValid === false) {
                containerProp.className += ' fcui2-checkbox-reject';
            }
            var doms = [];
            doms.push(<input {...inputProp} disabled={this.props.disabled} ref="inputbox" key="input"/>);
            doms[this.props.labelPosition === 'right' ? 'push' : 'unshift'](
                <span {...labelProp} key="label">{this.props.label}</span>
            );
            return (<div {...containerProp}>{doms}</div>);
        }
    });
});
