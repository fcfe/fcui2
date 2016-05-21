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
            var width = this.props.width;
            width = isNaN(width) && this.props.hasOwnProperty('style') && !isNaN(width) ? this.props.style.width: width;
            width = isNaN(width) ? 200 : width;
            return {
                width: width
            };
        },
        onTextBoxChange: function (e) {
            if (this.props.disabled) return;
            this.___dispatchChange___(e);
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
            var containerProp = cTools.containerBaseProps('searchbox', this, {
                style: {
                    width: this.state.width
                }
            });
            var inputProp = {
                ref: 'inputbox',
                width: this.state.width - 16,
                disabled: this.props.disabled,
                placeholder: this.props.placeholder,
                value: this.___getValue___(),
                onChange: this.onTextBoxChange
            };
            return (
                <div {...containerProp}>
                    <TextBox {...inputProp}/>
                    <div className="font-icon font-icon-search" onClick={this.onButtonClick}></div>
                </div>
            );
        }
    });
});
