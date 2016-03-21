/**
 * @file 日历组件
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.1
 */
define(function (require) {

// todo displayYear Month和NumberBox解耦
    var React = require('react');
    var language = require('./core/language');
    var util = require('./core/util');
    var tool = require('./core/calendarTools');


    var InputWidgetBase = require('./mixins/InputWidgetBase');
    var InputWidgetInForm = require('./mixins/InputWidgetInForm');


    var Button = require('./Button.jsx');
    var NumberBox = require('./NumberBox.jsx');


    return React.createClass({
        // @override
        mixins: [InputWidgetBase, InputWidgetInForm],
        // @override
        getDefaultProps: function () {
            return {
                className: '',
                min: '0-0-0',
                max: '9999-99-99',
                disable: false,
                valueTemplate: util.dateFormat(null, 'YYYY-MM-DD')
            };
        },
        // @override
        getInitialState: function () {
            var value = tool.str2date(this.___getValue___()) || new Date();
            return {
                displayYear: value.getFullYear(),
                displayMonth: value.getMonth()
            };
        },
        clickDayHandler: function (e) {
            if (this.props.disable) return;
            var timer = tool.str2date(
                this.state.displayYear + '-' + (this.state.displayMonth + 1) + '-' + e.target.value
            );
            e.target = this.refs.container;
            e.target.value = util.dateFormat(timer, 'YYYY-MM-DD');
            this.___dispatchChange___(e);
        },
        yearChangeHandler: function (e) {
            if (this.props.disable) return;
            this.setState({displayYear: e.target.value * 1});
        },
        monthChangeHandler: function (e) {
            if (this.props.disable) return;
            var month = e.target.value - 1;
            month = month < -1 ? -1 : month;
            month = month > 11 ? 11: month;
            this.setState({displayMonth: month});
        },
        addMonthHandler: function (e) {
            if (this.props.disable) return;
            var month = this.state.displayMonth;
            var year = this.state.displayYear;
            month = month * 1 + 1;
            if (month > 12) {
                month = 1;
                year = year * 1 + 1;
            }
            this.setState({
                displayYear: year,
                displayMonth: month
            });
        },
        subMonthHandler: function (e) {
            if (this.props.disable) return;
            var month = this.state.displayMonth;
            var year = this.state.displayYear;
            month = month * 1 - 1;
            if (month < 0) {
                month = 11;
                year = year * 1 - 1;
            }
            this.setState({
                displayYear: year,
                displayMonth: month
            });
        },
        render: function () {
            var containerProp = {
                className: 'fcui2-calendar ' + this.props.className,
                ref: 'container'
            };
            var yearInputProp = {
                min: 0,
                onChange: this.yearChangeHandler,
                value: this.state.displayYear,
                type: 'int',
                width: 70
            };
            var monthInputProp = {
                 min: 0,
                 max: 12,
                 onChange: this.monthChangeHandler,
                 className: 'calendar-month',
                 width: 60,
                 value: this.state.displayMonth + 1,
                 type: 'int'
            };
            var btnClass = 'fcui2-button' + (this.props.disable ? ' button-disable' : '')
                +' font-icon font-icon-largeable-caret-';
            return (
                <div {...containerProp}>
                    <div className="calendar-operation">
                        <div className={btnClass + 'right'} onClick={this.addMonthHandler}/>
                        <div className={btnClass + 'left'} onClick={this.subMonthHandler}/>
                        <NumberBox {...yearInputProp} disable={this.props.disable}/>
                        <NumberBox {...monthInputProp} disable={this.props.disable}/>
                    </div>
                    <div className="calendar-day-label">{language.calendar.day.map(produceDayLabel)}</div>
                    <div className="calendar-buttons">{produceButtons(this)}</div>
                </div>
            );
        }
    });


    function produceDayLabel(v) {
        return <div key={'day-' + v}>{v}</div>;
    }


    function produceButtons(me) {

        var value = tool.str2date(me.___getValue___()) || new Date();
        var min = tool.str2date(me.props.min) || tool.str2date('0-0-0');
        var max = tool.str2date(me.props.max) || tool.str2date('9999-99-99');
        if (min.getTime() > max.getTime()) {
            var tmp = min;
            min = max;
            max = min;
        }
        var buttons = [];

        var timer = tool.str2date(me.state.displayYear + '-' + (me.state.displayMonth + 1) + '-1');
        var tmpTimer = new Date();

        // 导入本月之前日期
        tmpTimer.setTime(timer.getTime());
        for (var i = 0; i < (timer.getDay() || 7) - 1; i++) {
            tmpTimer.setDate(tmpTimer.getDate() - 1);
            buttons.unshift(
                <Button {...tool.buttonProps(tmpTimer, true, buttons.length)}/>
            );
        }

        // 导入本月日期
        tmpTimer.setTime(timer.getTime());
        while (tmpTimer.getMonth() === timer.getMonth()) {
            var disable = tool.compareDate(tmpTimer, min) === -1
                || tool.compareDate(tmpTimer, max) === 1
                || me.props.disable;
            var skin = tool.compareDate(tmpTimer, value) === 0 ? 'active' : null;
            var props = {
                onClick: me.clickDayHandler,
                value: tmpTimer.getDate()
            };
            buttons.push(
                <Button {...tool.buttonProps(tmpTimer, disable, buttons.length, skin)} {...props}/>
            );
            tmpTimer.setDate(tmpTimer.getDate() + 1);
        }

        // 导入本月后的日期
        while(buttons.length < 42) {
            buttons.push(
                <Button {...tool.buttonProps(tmpTimer, true, buttons.length)}/>
            );
            tmpTimer.setDate(tmpTimer.getDate() + 1);
        }
   
        return buttons;
    }

});
