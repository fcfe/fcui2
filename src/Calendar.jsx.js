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
    var factory = require('./factories/calendarFactory.jsx');


    var InputWidget = require('./mixins/InputWidget');


    return React.createClass({
        /**
         * @properties
         *
         * @param {Import|Properties} src\core\componentTools.js skin className style disabled
         * @param {String} min 日历最小值，在这一天之前的日期不能被选定，格式：YYYY-MM-DD
         * @param {String} max 日历最大值，在这一天之后的日期不能被选定，格式：YYYY-MM-DD
         * @param {Import|Properties} src\mixins\InputWidget.js
         *      value onChange name validations customErrorTemplates valueTemplate
         */
        /**
         * @fire Import src\mixins\InputWidget.js XXX onChange
         */
        // @override
        contextTypes: {
            appSkin: React.PropTypes.string
        },
        // @override
        childContextTypes: {
            appSkin: React.PropTypes.string
        },
        // @override
        getChildContext: function () {
            return {
                appSkin: ''
            };
        },
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
            e = {target: this.refs.container};
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
            return (
                <div {...cTools.containerBaseProps('calendar', this)}>
                    {
                        this.context.appSkin !== 'oneux4'
                        ? factory.normalOperationBarFactory(this)
                        : factory.oneux4OperationBarFactory(this)
                    }
                    <div className="calendar-day-label">{
                        this.state.inRange
                            ? language.calendar.day.map(factory.dayLabelFactory)
                            : (this.props.min.replace(/-/g, '.') + ' - ' + this.props.max.replace(/-/g, '.'))
                    }</div>
                    <div className="calendar-buttons">{factory.buttonFactory(this)}</div>
                </div>
            );
        }
    });


});
