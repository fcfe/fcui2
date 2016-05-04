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
    var SingleRegion = require('../SingleRegion.jsx');
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
                close: function () {},
                type: 'multi'
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
        singleRegionChangeHandler: function (e) {
            this.setState({value: e.target.value});
            var event = {};
            event.target = this.refs.container;
            event.target.value = e.target.value;
            this.props.onChange(event);
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
                disabled: this.state.value === this.props.value,
                label: language.enter,
                skin: 'important',
                onClick: this.enterHandler
            };
            var regionProp = {
                shortCut: this.props.shortCut,
                value: this.state.value,
                onChange: (this.props.type === 'single') ? this.singleRegionChangeHandler : this.changeHandler
            };
            if (this.props.type === 'single') {
            return (
                <div {...containerProp}>
                        <SingleRegion {...regionProp}/>
                    </div>
                );
            }
            else {
                return (
                    <div {...containerProp}>
                        <Region {...regionProp}/>
                    <div className="button-bar">
                        <Button {...enterButtonProp}/>
                        <Button label={language.cancel} onClick={this.props.close}/>
                    </div>
                </div>
            );
        }
        }
    });
});
