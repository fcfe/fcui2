/**
 * @file 日历组件
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.1
 */
define(function (require) {


    var React = require('react');
    var language = require('./core/language');
    var util = require('./core/util');
    var tool = require('./core/calendarTools');


    var InputWidget = require('./mixins/InputWidget');
    


    var Button = require('./Button.jsx');
    var NumberBox = require('./NumberBox.jsx');


    return React.createClass({
        // @override
        mixins: [InputWidget],
        // @override
        getDefaultProps: function () {
            return {
                className: '',
                min: '0-1-1',
                max: '9999-12-31',
                disabled: false,
                valueTemplate: util.dateFormat(null, 'YYYY-MM-DD')
            };
        },
        // @override
        getInitialState: function () {
            var value = tool.str2date(this.___getValue___()) || new Date();
            return {
                displayYear: value.getFullYear(),
                displayMonth: value.getMonth(),
                inputYear: value.getFullYear(),
                inputMonth: value.getMonth() + 1,
                inRange: true
            };
        },
        monthInRange: function (year, month) {
            var inRange = tool.monthInRange(year, month, this.props.min, this.props.max);
            this.setState({inRange: inRange});
        },
        clickDayHandler: function (e) {
            if (this.props.disabled) return;
            var timer = tool.str2date(
                this.state.displayYear + '-' + (this.state.displayMonth + 1) + '-' + e.target.value
            );
            e.target = this.refs.container;
            e.target.value = util.dateFormat(timer, 'YYYY-MM-DD');
            this.___dispatchChange___(e);
        },
        yearChangeHandler: function (e) {
            if (this.props.disabled) return;
            var year = this.state.displayYear;
            if (!isNaN(e.target.value)) {
                year = e.target.value * 1;
            }
            this.monthInRange(year, this.state.displayMonth);
            this.setState({
                inputYear: e.target.value,
                displayYear: year
            });
        },
        monthChangeHandler: function (e) {
            if (this.props.disabled) return;
            var month = this.state.displayMonth;
            if (!isNaN(e.target.value)) {
                month = e.target.value * 1 - 1;
                month = month < -1 ? -1 : month;
                month = month > 11 ? 11: month;
            }
            this.monthInRange(this.state.displayYear, month);
            this.setState({
                inputMonth: e.target.value,
                displayMonth: month
            });
        },
        addMonthHandler: function (e) {
            if (this.props.disabled) return;
            var month = this.state.displayMonth;
            var year = this.state.displayYear;
            month = month * 1 + 1;
            if (month > 11) {
                month = 0;
                year = year * 1 + 1;
            }
            this.monthInRange(year, month);
            this.setState({
                displayYear: year,
                displayMonth: month,
                inputYear: year,
                inputMonth: month + 1
            });
        },
        subMonthHandler: function (e) {
            if (this.props.disabled) return;
            var month = this.state.displayMonth;
            var year = this.state.displayYear;
            month = month * 1 - 1;
            if (month < 0) {
                month = 11;
                year = year * 1 - 1;
            }
            this.monthInRange(year, month);
            this.setState({
                displayYear: year,
                displayMonth: month,
                inputYear: year,
                inputMonth: month + 1
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
                value: this.state.inputYear,
                type: 'int',
                ref: 'inputYear',
                width: 70
            };
            var monthInputProp = {
                 min: 1,
                 max: 12,
                 onChange: this.monthChangeHandler,
                 className: 'calendar-month',
                 width: 60,
                 value: this.state.inputMonth,
                 ref: 'inputMonth',
                 type: 'int'
            };
            var btnClass = 'fcui2-button' + (this.props.disabled ? ' button-disabled' : '')
                +' font-icon font-icon-largeable-caret-';
            var range = this.props.min.replace(/-/g, '.') + ' - ' + this.props.max.replace(/-/g, '.');
            return (
                <div {...containerProp}>
                    <div className="calendar-operation">
                        <div className={btnClass + 'right'} onClick={this.addMonthHandler}/>
                        <div className={btnClass + 'left'} onClick={this.subMonthHandler}/>
                        <NumberBox {...yearInputProp} disabled={this.props.disabled}/>
                        <NumberBox {...monthInputProp} disabled={this.props.disabled}/>
                    </div>
                    <div className="calendar-day-label">{
                        this.state.inRange ? language.calendar.day.map(produceDayLabel) : range
                    }</div>
                    <div className="calendar-buttons">{produceButtons(this)}</div>
                </div>
            );
        }
    });


    // 生成button props
    function buttonProps(timer, disabled, key, skin) {
        skin = skin || 'calendar';
        return {
            style: {
                left: (key % 7) * 32,
                top: parseInt(key / 7, 10) * 32
            },
            skin: skin,
            minWidth: 12,
            label: timer.getDate() + '',
            disabled: disabled,
            key: 'btns-' + key
        };
    }


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
        for (var i = (timer.getDay() || 7) - 1; i > 0; i--) {
            tmpTimer.setTime(timer.getTime());
            tmpTimer.setDate(timer.getDate() - i);
            buttons.push(
                <Button {...buttonProps(tmpTimer, true, buttons.length)}/>
            );
        }

        // 导入本月日期
        tmpTimer.setTime(timer.getTime());
        while (tmpTimer.getMonth() === timer.getMonth()) {
            var disabled = tool.compareDate(tmpTimer, min) === -1
                || tool.compareDate(tmpTimer, max) === 1
                || me.props.disabled;
            var skin = tool.compareDate(tmpTimer, value) === 0 ? 'active' : null;
            var props = {
                onClick: me.clickDayHandler,
                value: tmpTimer.getDate()
            };
            buttons.push(
                <Button {...buttonProps(tmpTimer, disabled, buttons.length, skin)} {...props}/>
            );
            tmpTimer.setDate(tmpTimer.getDate() + 1);
        }

        // 导入本月后的日期
        while(buttons.length < 42) {
            buttons.push(
                <Button {...buttonProps(tmpTimer, true, buttons.length)}/>
            );
            tmpTimer.setDate(tmpTimer.getDate() + 1);
        }
   
        return buttons;
    }

});
