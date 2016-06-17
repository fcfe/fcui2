/**
 * 日历
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2.1
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
        /**
         * @properties
         *
         * @param {Import|Properties} src\core\componentTools.js skin className style disabled
         * @param {String} min 日历最小值，在这一天之前的日期不能被选定，格式：YYYY-MM-DD
         * @param {String} max 日历最大值，在这一天之后的日期不能被选定，格式：YYYY-MM-DD
         * @param {Import|Properties} src\mixins\InputWidget.js
         *      value onChange name validations customErrorTemplates valueLink valueTemplate
         */
        /**
         * @fire Import src\mixins\InputWidget.js XXX onChange
         */
        // @override
        mixins: [InputWidget],
        // @override
        getDefaultProps: function () {
            return {
                skin: '',
                className: '',
                style: {},
                disabled: false,
                // self
                min: '0-1-1',
                max: '9999-12-31',
                // mixin
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
        // 主区域表示天的按钮被点击
        onDayClick: function (e) {
            if (this.props.disabled) return;
            var timer = tool.str2date(
                this.state.displayYear + '-' + (this.state.displayMonth + 1) + '-' + e.target.value
            );
            e.target = this.refs.container;
            e.target.value = util.dateFormat(timer, 'YYYY-MM-DD');
            this.___dispatchChange___(e);
        },
        // 操作区年输入框被修改
        onYearChange: function (e) {
            if (this.props.disabled) return;
            var year = this.state.displayYear;
            if (!isNaN(e.target.value)) {
                year = e.target.value * 1;
            }
            this.setState({
                inputYear: e.target.value,
                displayYear: year,
                inRange: tool.monthInRange(year, this.state.displayMonth, this.props.min, this.props.max)
            });
        },
        // 操作区月输入框被修改
        onMonthChange: function (e) {
            if (this.props.disabled) return;
            var month = this.state.displayMonth;
            if (!isNaN(e.target.value)) {
                month = e.target.value * 1 - 1;
                month = month < -1 ? -1 : month;
                month = month > 11 ? 11: month;
            }
            this.setState({
                inRange: tool.monthInRange(this.state.displayYear, month, this.props.min, this.props.max),
                inputMonth: e.target.value,
                displayMonth: month
            });
        },
        // 操作区右侧按钮被点击
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
        // 操作区左侧按钮被点击
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



    // 注意如下函数注释的写法/* */这样写不会被yuidocjs解析，因为这个函数的注释没必要出现在帮助文档中
    /*
     * 生成日历的星期栏
     * @param {string} v 星期几
     * @return {ReactComponent} 星期标签
     */
    function dayLabelFactory(v) {
        return <div key={'day-' + v}>{v}</div>;
    }


    /*
     * 生成按钮属性
     * 
     * @param {Date} timer 当前按钮代表的时间
     * @param {boolean} disabled 按钮是否可用
     * @param {string} key 按钮键值
     * @param {string} skin 按钮皮肤
     * @return {Object} 用于初始化按钮的属性集合
     */
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


    /*
     * 生成主区域每天的按钮
     *
     * @param {Object} me 日历组件实例
     * @return {Array.<ReactComponent>} 按钮集合
     */
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
            buttons.push(<Button {...buttonPropsFactory(tmpTimer, true, buttons.length)}/>);
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
            buttons.push(<Button {...buttonPropsFactory(tmpTimer, disabled, buttons.length, skin)} {...props}/>);
            tmpTimer.setDate(tmpTimer.getDate() + 1);
        }

        // 导入本月后的日期
        while(buttons.length < 42) {
            buttons.push(<Button {...buttonPropsFactory(tmpTimer, true, buttons.length)}/>);
            tmpTimer.setDate(tmpTimer.getDate() + 1);
        }
   
        return buttons;
    }


});
