/**
 * @file 地域选择框组件浮层
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.1
 */
define(function (require) {


    var React = require('react');
    var MouseWidgetBase = require('../mixins/MouseWidgetBase');

    var Region = require('../Region.jsx');
    var Button = require('../Button.jsx');
    var language = require('../core/language').rangeCalendar;


    // 浮层中的内容
    return React.createClass({
        // @override
        mixins: [MouseWidgetBase],
        // @override
        getDefaultProps: function () {
            return {
                value: '',
                shortCut: [],
                onChange: function () {},
                close: function () {}
            }
        },
        // @override
        componentWillReceiveProps: function (nextProps) {
            this.setState({value: nextProps.value});
        },
        // @override
        getInitialState: function () {
            return {value: this.props.value};
        },
        changeHandler: function (e) {
            this.setState({value: e.target.value});
        },
        enterHandler: function (e) {
            e.target = this.refs.container;
            e.target.value = this.state.value;
            this.props.onChange(e);
        },
        render: function () {
            var containerProp = {
                ref: 'container',
                className: 'fcui2-dropdownschedule',
                onMouseEnter: this.___mouseenterHandler___,
                onMouseLeave: this.___mouseleaveHandler___,
                style: {
                    width: 700
                }
            };
            var enterButtonProp = {
                disable: this.state.value === this.props.value,
                label: language.enter,
                skin: 'important',
                onClick: this.enterHandler
            };
            return (
                <div {...containerProp}>
                    <Region shortCut={this.props.shortCut} value={this.state.value} onChange={this.changeHandler}/>
                    <div className="button-bar">
                        <Button {...enterButtonProp}/>
                        <Button label={language.cancel} onClick={this.props.close}/>
                    </div>
                </div>
            );
        }
    });
});
