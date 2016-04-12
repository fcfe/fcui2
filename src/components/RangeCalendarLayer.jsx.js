/**
 * @file 日期区间选择框组件浮层
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.1
 */
define(function (require) {


    var React = require('react');
    var MouseWidgetBase = require('../mixins/MouseWidgetBase');

    var tools = require('../core/calendarTools');
    var util = require('../core/util');
    var language = require('../core/language').rangeCalendar;

    var Calendar = require('../Calendar.jsx');
    var Button = require('../Button.jsx');


    function cutValues(values) {
        var valueArr = (values + '').split(';');
        var value1 = null;
        var value2 = null;
        switch (valueArr.length) {
            case 1:
                value1 = tools.str2date(valueArr[0]) || new Date();
                value2 = value1;
                break;
            case 2:
                value1 = tools.str2date(valueArr[0]) || new Date();
                value2 = tools.str2date(valueArr[1]) || new Date();
                break;
            default:
                value1 = new Date();
                value2 = new Date();
                break;
        }
        if (tools.compareDate(value1, value2) === 1) { // value1 > value2
            var tmp = value1;
            value1 = value2;
            value2 = tmp;
        }
        return {
            ___v1: value1,
            ___v2: value2,
            value1: util.dateFormat(value1, 'YYYY-MM-DD'),
            value2: util.dateFormat(value2, 'YYYY-MM-DD')
        };
    }


    // 浮层中的内容
    return React.createClass({
        // @override
        mixins: [MouseWidgetBase],
        // @override
        getDefaultProps: function () {
            return {
                min: '0-1-1',
                max: '9999-12-31',
                value: '',
                shortCut: [],
                rangeValidator: function () {},
                onChange: function () {},
                close: function () {}
            }
        },
        // @override
        componentWillReceiveProps: function (nextProps) {
            var statechange = cutValues(nextProps.value);
            statechange.rangeValidationResult = '';
            this.setState(statechange);
        },
        // @override
        getInitialState: function () {
            return cutValues(this.props.value);
        },
        shortCutClickHandler: function (e) {
            var i = util.getDataset(e.target).uiCmd * 1;
            var values = this.props.shortCut[i].getValues();
            if (!values) return;
            var min = tools.str2date(this.props.min) || tools.str2date('0-1-1');
            var max = tools.str2date(this.props.max) || tools.str2date('9999-12-31');
            if (tools.compareDate(min, max) === 1) { // min > max
                var tmp = min;
                min = max;
                max = tmp;
            }
            values.___v1 = values.value1;
            values.___v2 = values.value2;
            // value2 < min // max < value1
            if (tools.compareDate(values.___v2, min) === -1 || tools.compareDate(max, values.___v1) === -1 ) return;
            // value1 < min
            if (tools.compareDate(values.___v1, min) === -1) values.___v1 = min;
            // max < value2
            if (tools.compareDate(max, values.___v2) === -1) values.___v2 = max;
            values.value1 = util.dateFormat(values.___v1, 'YYYY-MM-DD');
            values.value2 = util.dateFormat(values.___v2, 'YYYY-MM-DD');
            values.rangeValidationResult = this.props.rangeValidator(values.___v1, values.___v2);
            if (typeof values.rangeValidationResult !== 'string') values.rangeValidationResult = '';
            this.refs.c1.setState({
                displayYear: values.___v1.getFullYear(),
                displayMonth: values.___v1.getMonth(),
                inputYear: values.___v1.getFullYear(),
                inputMonth: values.___v1.getMonth() + 1
            });
            this.refs.c2.setState({
                displayYear: values.___v2.getFullYear(),
                displayMonth: values.___v2.getMonth(),
                inputYear: values.___v2.getFullYear(),
                inputMonth: values.___v2.getMonth() + 1
            });
            this.setState(values);
        },
        c1ChangeHandler: function (e) {
            var value = tools.str2date(e.target.value);
            var rangeValidationResult = this.props.rangeValidator(value, this.state.___v2);
            this.setState({
                ___v1: value,
                value1: e.target.value,
                rangeValidationResult: typeof rangeValidationResult === 'string' ? rangeValidationResult : ''
            });
        },
        c2ChangeHandler: function (e) {
            var value = tools.str2date(e.target.value);
            var rangeValidationResult = this.props.rangeValidator(this.state.___v1, value);
            this.setState({
                ___v2: value,
                value2: e.target.value,
                rangeValidationResult: typeof rangeValidationResult === 'string' ? rangeValidationResult : ''
            });
        },
        enterHandler: function (e) {
            e.target = this.refs.container;
            e.target.value = this.state.value1 + ';' + this.state.value2;
            this.props.onChange(e);
        },
        render: function () {
            var tpl = 'YYYY-MM-DD';
            var min = tools.str2date(this.props.min) || tools.str2date('0-1-1');
            var max = tools.str2date(this.props.max) || tools.str2date('9999-12-31');
            if (tools.compareDate(min, max) === 1) { // min > max
                var tmp = min;
                min = max;
                max = tmp;
            }
            var c1Prop = {
                ref: 'c1',
                min: util.dateFormat(min, tpl),
                value: this.state.value1,
                max: util.dateFormat(this.state.value2, tpl),
                onChange: this.c1ChangeHandler
            };
            var c2Prop = {
                ref: 'c2',
                min: util.dateFormat(this.state.value1, tpl),
                value: this.state.value2,
                max: util.dateFormat(max, tpl),
                onChange: this.c2ChangeHandler
            };
            var containerProp = {
                className: 'fcui2-range-calendar',
                ref: 'container',
                onMouseEnter: this.___mouseenterHandler___,
                onMouseLeave: this.___mouseleaveHandler___
            };
            var enterButtonProp = {
                disabled: typeof this.state.rangeValidationResult === 'string'
                    && this.state.rangeValidationResult.length > 0,
                label: language.enter,
                skin: 'important',
                onClick: this.enterHandler
            };
            return (
                <div {...containerProp}>
                    <div className="fast-operation-bar">
                        {shortCutFactory(this)}
                    </div>
                    <div className="resuit-display-bar">
                        <div>{language.startTime + this.state.value1}</div>
                        <div>{language.endTime + this.state.value2}</div>
                    </div>
                    <Calendar {...c1Prop}/>
                    <Calendar {...c2Prop}/>
                    <div className="button-bar">
                        <Button {...enterButtonProp}/>
                        <Button label={language.cancel} onClick={this.props.close}/>
                        <span>{this.state.rangeValidationResult}</span>
                    </div>
                </div>
            );
        }
    });
    
    function shortCutFactory(me) {
        var shortCut = me.props.shortCut;
        if (! shortCut instanceof Array || shortCut.length === 0) return '';
        var doms = [];
        for (var i = 0; i < shortCut.length; i++) {
            var props = {
                key: 'shortcut-' + i,
                'data-ui-cmd': i,
                onClick: me.shortCutClickHandler
            };
            doms.push(<div {...props}>{shortCut[i].label}</div>);
        }
        return doms;
    }

});
