/**
 * @file 日历组件
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2
 */
define(function (require) {


    var React = require('react');
    var language = require('./core/language');
    var util = require('./core/util');
    var tool = require('./core/calendarTools');
    var cTools = require('./core/componentTools');


    var InputWidget = require('./mixins/InputWidget');
    var Button = require('./Button.jsx');
    var NumberBox = require('./NumberBox.jsx');


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
                min: '0-1-1',
                max: '9999-12-31',
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
        onDayClick: function (e) {
            if (this.props.disabled) return;
            var timer = tool.str2date(
                this.state.displayYear + '-' + (this.state.displayMonth + 1) + '-' + e.target.value
            );
            e.target = this.refs.container;
            e.target.value = util.dateFormat(timer, 'YYYY-MM-DD');
            this.___dispatchChange___(e);
        },
        onYearChange: function (e) {
            if (this.props.disabled) return;
            var year = this.state.displayYear;
            if (!isNaN(e.target.value)) {
                year = e.target.value * 1;
            }
            ;
            this.setState({
                inputYear: e.target.value,
                displayYear: year,
                inRange: tool.monthInRange(year, this.state.displayMonth, this.props.min, this.props.max)
            });
        },
        onMonthChange: function (e) {
            if (this.props.disabled) return;
            var month = this.state.displayMonth;
            if (!isNaN(e.target.value)) {
                month = e.target.value * 1 - 1;
                month = month < -1 ? -1 : month;
                month = month > 11 ? 11: month;
            }
            //this.monthInRange();
            this.setState({
                inRange: tool.monthInRange(this.state.displayYear, month, this.props.min, this.props.max),
                inputMonth: e.target.value,
                displayMonth: month
            });
        },
        onMonthAdd: function (e) {
            if (this.props.disabled) return;
            var month = this.state.displayMonth;
            var year = this.state.displayYear;
            month = month * 1 + 1;
            if (month > 11) {
                month = 0;
                year = year * 1 + 1;
            }
            this.setState({
                inRange: tool.monthInRange(year, month, this.props.min, this.props.max),
                displayYear: year,
                displayMonth: month,
                inputYear: year,
                inputMonth: month + 1
            });
        },
        onMonthSub: function (e) {
            if (this.props.disabled) return;
            var month = this.state.displayMonth;
            var year = this.state.displayYear;
            month = month * 1 - 1;
            if (month < 0) {
                month = 11;
                year = year * 1 - 1;
            }
            this.setState({
                inRange: tool.monthInRange(year, month, this.props.min, this.props.max),
                displayYear: year,
                displayMonth: month,
                inputYear: year,
                inputMonth: month + 1
            });
        },
        render: function () {
            var containerProp = cTools.containerBaseProps('calendar', this);
            var yearInputProp = {
                ref: 'inputYear',
                min: 0,
                max: 9999,
                onChange: this.onYearChange,
                value: this.state.inputYear,
                type: 'int',
                style: {width: 75, left: 43}
            };
            var monthInputProp = {
                ref: 'inputMonth',
                min: 1,
                max: 12,
                onChange: this.onMonthChange,
                value: this.state.inputMonth,
                type: 'int',
                style: {width: 60, right: 43}
            };
            var subBtnProp = {
                icon: 'font-icon-largeable-caret-left',
                label: '',
                onClick: this.onMonthSub,
                disabled: this.props.disabled
            };
            var addBtnProp = {
                icon: 'font-icon-largeable-caret-right',
                label: '',
                onClick: this.onMonthAdd,
                disabled: this.props.disabled
            };
            return (
                <div {...containerProp}>
                    <div className="calendar-operation">
                        <Button {...subBtnProp}/>
                        <NumberBox {...yearInputProp} disabled={this.props.disabled}/>
                        <NumberBox {...monthInputProp} disabled={this.props.disabled}/>
                        <Button {...addBtnProp}/>
                    </div>
                    <div className="calendar-day-label">{
                        this.state.inRange
                            ? language.calendar.day.map(dayLabelFactory)
                            : (this.props.min.replace(/-/g, '.') + ' - ' + this.props.max.replace(/-/g, '.'))
                    }</div>
                    <div className="calendar-buttons">{buttonFactory(this)}</div>
                </div>
            );
        }
    });


    function dayLabelFactory(v) {
        return <div key={'day-' + v}>{v}</div>;
    }


    function buttonPropsFactory(timer, disabled, key, skin) {
        skin = skin || 'calendar';
        return {
            style: {
                left: (key % 7) * 32,
                top: parseInt(key / 7, 10) * 32
            },
            skin: skin,
            label: timer.getDate() + '',
            disabled: disabled,
            key: 'btns-' + key
        };
    }


    function buttonFactory(me) {

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
                <Button {...buttonPropsFactory(tmpTimer, true, buttons.length)}/>
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
                onClick: me.onDayClick,
                value: tmpTimer.getDate()
            };
            buttons.push(
                <Button {...buttonPropsFactory(tmpTimer, disabled, buttons.length, skin)} {...props}/>
            );
            tmpTimer.setDate(tmpTimer.getDate() + 1);
        }

        // 导入本月后的日期
        while(buttons.length < 42) {
            buttons.push(
                <Button {...buttonPropsFactory(tmpTimer, true, buttons.length)}/>
            );
            tmpTimer.setDate(tmpTimer.getDate() + 1);
        }
   
        return buttons;
    }

});
