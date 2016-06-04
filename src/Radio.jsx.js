/**
 * @file 单选框组件
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
                ___uitype___: 'radio',
                skin: '',
                className: '',
                style: {},
                disabled: false,
                name: undefined,
                label: '',
                value: '',
                labelPosition: 'right',
                valueTemplate: false
            };
        },
        // @override
        getInitialState: function () {
            return {};
        },
        onLayerClick: function (e) {
            if (this.props.disabled) return;
            e.target = this.refs.inputbox;
            if (!e.target.checked) {
                e.target.checked = !e.target.checked;
                this.___dispatchChange___(e);
            }
        },
        render: function () {
            var containerProp = cTools.containerBaseProps('checkbox', this, {
                style: {position: 'relative'}
            });
            var inputProp = {
                key: 'inputbox',
                ref: 'inputbox',
                type: 'radio',
                name: this.props.name,
                value: this.props.value,
                checked: this.___getValue___(),
                onChange: cTools.noop,
                disabled: this.props.disabled
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
                onClick: this.onLayerClick
            };
            var doms = [];
            doms.push(<input {...inputProp}/>);
            doms[this.props.labelPosition === 'right' ? 'push' : 'unshift'](
                <span className="fcui2-checkbox-label" key="label">{this.props.label}</span>
            );
            doms.push(<div {...actionLayerProp}></div>);
            return (<div {...containerProp}>{doms}</div>);
        }
    });
});
