/**
 * @file 单选框组件
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.1
 */
define(function (require) {


    var React = require('react');
    var InputWidgetBase = require('./mixins/InputWidgetBase');
    var InputWidgetInForm = require('./mixins/InputWidgetInForm');


    return React.createClass({
        // @override
        mixins: [InputWidgetBase, InputWidgetInForm],
        // @override
        getDefaultProps: function () {
            return {
                ___uitype___: 'radio',
                className: '',
                label: '',
                value: '',
                labelPosition: 'left',
                disabled: false,
                valueTemplate: false
            };
        },
        // @override
        getInitialState: function () {
            return {};
        },
        clickHandler: function (e) {
            if (this.props.disabled) return;
            e.target = this.refs.inputbox;
            if (!e.target.checked) {
                e.target.checked = !e.target.checked;
                this.___dispatchChange___(e);
            }
        },
        render: function () {
            var containerProp = {
                className: 'fcui2-checkbox ' + this.props.className,
                style: {
                    position: 'relative'
                }
            };
            var inputProp = {
                type: 'radio',
                name: this.props.name, // radio 跟其他input组件不一样，它需要用name控制单选，所以这个属性要下传
                value: this.props.value, // 这个value用来标记是哪个radio，而不是radio的选中状态
                checked: this.___getValue___()
            };
            var actionLayerProp = {
                key: 'action-layer',
                style: {
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: '100%',
                    height: '100%',
                    cursor: 'pointer'
                },
                onClick: this.clickHandler
            };
            if (this.props.disabled) {
                containerProp.className += ' fcui2-checkbox-disabled';
            }
            else if (this.state.isValid === false) {
                containerProp.className += ' fcui2-checkbox-reject';
            }
            var doms = [];
            doms.push(
                <input {...inputProp} disabled={this.props.disabled} ref="inputbox" key="input"/>
            );
            doms[this.props.labelPosition === 'right' ? 'push' : 'unshift'](
                <span className="fcui2-checkbox-label" key="label">{this.props.label}</span>
            );
            doms.push(
                <div {...actionLayerProp}></div>
            );
            return (
                <div {...containerProp}>{doms}</div>
            );
        }
    });
});
