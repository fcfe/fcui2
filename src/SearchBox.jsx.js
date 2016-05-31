/**
 * @file 搜索框组件
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2
 */
define(function (require) {


    var React = require('react');
    var InputWidget = require('./mixins/InputWidget');
    var TextBox = require('./TextBox.jsx');
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
                placeholder: '',
                valueTemplate: '',
                onClick: function () {}
            };
        },
        // @override
        getInitialState: function () {
            return {};
        },
        onButtonClick: function (e) {
            e.target = this.refs.container;
            e.target.value = this.___getValue___();
            this.props.onClick(e);
        },
        focus: function () {
            this.refs.inputbox.focus();
        },
        render: function () {
            var width = cTools.getValueFromPropsAndStyle(this.props, 'width', 200);
            var containerProp = cTools.containerBaseProps('searchbox', this, {
                style: {width: width}
            });
            var inputProp = {
                ref: 'inputbox',
                width: width - 16,
                disabled: this.props.disabled,
                placeholder: this.props.placeholder,
                value: this.___getValue___(),
                onChange: this.props.onChange
            };
            console.log(inputProp);
            return (
                <div {...containerProp}>
                    <TextBox {...inputProp}/>
                    <div className="font-icon font-icon-search" onClick={this.onButtonClick}></div>
                </div>
            );
        }
    });
});
