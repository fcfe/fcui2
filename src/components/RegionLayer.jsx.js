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
                close: function () {},
                type: 'multi'
            }
        },
        componentDidMount: function () {
            this.___autoHideTimer___ = null;
            this.___autoHideTimerBeep___ = 0;
        },
        componentWillUnmount: function () {
            clearInterval(this.___autoHideTimer___);
            this.___autoHideTimerBeep___ = 0;
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
        mouseEnterHandler: function (e) {
            clearInterval(this.___autoHideTimer___);
            this.___mouseenterHandler___();
        },
        mouseLeaveHandler: function (e) {
            this.___mouseleaveHandler___();
            var me = this;
            me.___autoHideTimerBeep___ = 0;
            this.___autoHideTimer___ = setInterval(function () {
                me.autoHideLayer();
            }, 100);
        },
        autoHideLayer: function () {
            if (!this.refs || !this.refs.region || this.props.type !== 'single') {
                clearInterval(this.___autoHideTimer___);
                return;
            }
            this.___autoHideTimerBeep___++;
            if (this.refs.region.___layerShow___.length === 0 || this.___autoHideTimerBeep___ > 40) { // 不操作5s隐藏
                clearInterval(this.___autoHideTimer___);
                this.props.close();
            }
        },
        render: function () {
            var containerProp = {
                ref: 'container',
                onMouseEnter: this.mouseEnterHandler,
                onMouseLeave: this.mouseLeaveHandler,
                style: {
                    width: 700,
                    height: this.props.type === 'single' ? 370 : 400,
                    position: 'relative'
                }
            };
            var buttonContainer = {
                style: {
                    position: 'absolute',
                    top: 360,
                    left: 15,
                    display: this.props.type === 'single' ? 'none': 'block'
                }
            };
            var enterButtonProp = {
                disabled: this.state.value === this.props.value,
                label: language.enter,
                skin: 'important',
                onClick: this.enterHandler
            };
            var cancelButtonProp = {
                label: language.cancel,
                style: {
                    position: 'relative',
                    left: 10
                },
                onClick: this.props.close
            };
            var regionProp = {
                ref: 'region',
                shortCut: this.props.shortCut,
                value: this.state.value,
                type: this.props.type,
                onChange: (this.props.type === 'single') ? this.singleRegionChangeHandler : this.changeHandler
            };
            return (
                <div {...containerProp}>
                    <Region {...regionProp} />
                    <div {...buttonContainer}>
                        <Button {...enterButtonProp}/>
                        <Button {...cancelButtonProp}/>
                    </div>
                </div>
            );
        }
    });
});
