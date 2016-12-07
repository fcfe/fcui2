/**
 * 日期区间选择器
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2.1
 */
define(function (require) {


    var React = require('react');
    var InputWidget = require('./mixins/InputWidget');
    var Layer = require('./Layer.jsx');

    var cTools = require('./core/componentTools');
    var tools = require('./core/calendarTools');
    var util = require('./core/util');
    var factory = require('./factories/rangeCalendarFactory.jsx');


    // 浮层弹出按钮
    return React.createClass({
        /**
         * @properties
         *
         * @param {Import|Properties} src\core\componentTools.js skin className style disabled
         * @param {String} placeholder 弹出按钮默认显示的文字，如果选择了日期区间，则此项不显示
         * @param {String} max 日历最大值，在这一天之后的日期不能被选定，格式：YYYY-MM-DD
         * @param {String} min 日历最小值，在这一天之前的日期不能被选定，格式：YYYY-MM-DD
         * @param {Array.<CalendarShortCut>} shortCut 快捷选择按钮配置
         * @param {Function} rangeValidator 日期区间校验机
         * @param {Import|Properties} src\mixins\InputWidget.js
         *      value onChange name validations customErrorTemplates valueTemplate
         */
        /**
         * @fire Import src\mixins\InputWidget.js XXX onChange
         */
        /**
         * @fire RangeCalendar rangeValidator
         * @param {Date} param1 左侧日历的日期
         * @param {Date} param2 右侧日历的日期
         * @return {Boolean|String} 请返回校验结果，字符串表示校验未通过。
         */
        /**
         * @structure CalendarShortCut
         * @example
         *  {
         *      label: '',                  <required>
         *      getValues: function () {    <required>
         *          return {
         *              value1: new Date(), <required>
         *              value2: new Date()  <required>
         *          };
         *      }
         *  }
         * @param {String} label 快捷按钮标签
         * @param {Function} getValues 返回值接口
         */
        // @override
        contextTypes: {
            appSkin: React.PropTypes.string
        },
        // @override
        mixins: [InputWidget],
        // @override
        getDefaultProps: function () {
            return {
                // base
                skin: '',
                className: '',
                style: {},
                disabled: false,
                // self
                placeholder: 'please select',
                min: '0-1-1',
                max: '9999-12-31',
                shortCut: [],
                rangeValidator: function () {},
                // mixin
                valueTemplate: ''
            };
        },
        // @override
        getInitialState: function () {
            var values = tools.cutValues(this.___getValue___());
            values.layerOpen = false;
            values.rangeValidationResult = '';
            return values;
        },
        // @override
        componentWillReceiveProps: function (nextProps) {
            var state = tools.cutValues(nextProps.value);
            state.rangeValidationResult = '';
            this.setState(state);
        },
        onMainButtonClick: function (e) {
            if (this.props.disabled) return;
            this.setState({layerOpen: true});
        },
        onEnterButtonClick: function (e) {
            e.target = this.refs.container;
            e.target.value = this.state.value1 + ';' + this.state.value2;
            this.___dispatchChange___(e);
            this.setState({layerOpen: false});
        },
        onCancelButtonClick: function (e) {
            this.setState({layerOpen: false});
        },
        onShortCutClick: function (e) {
            var i = util.getDataset(e.target).uiCmd * 1;
            var values = this.props.shortCut[i].getValues();
            if (!values || !values.value1 || !values.value2) return;
            var min = tools.str2date(this.props.min) || tools.str2date('0-1-1');
            var max = tools.str2date(this.props.max) || tools.str2date('9999-12-31');
            if (tools.compareDate(min, max) === 1) { // min > max
                var tmp = min;
                min = max;
                max = tmp;
            }
            values.___v1 = values.value1;
            values.___v2 = values.value2;
            // value2 < min || max < value1
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
        onCalendarChange1: function (e) {
            var value = tools.str2date(e.target.value);
            var rangeValidationResult = this.props.rangeValidator(value, this.state.___v2);
            this.setState({
                ___v1: value,
                value1: e.target.value,
                rangeValidationResult: typeof rangeValidationResult === 'string' ? rangeValidationResult : ''
            });
        },
        onCalendarChange2: function (e) {
            var value = tools.str2date(e.target.value);
            var rangeValidationResult = this.props.rangeValidator(this.state.___v1, value);
            this.setState({
                ___v2: value,
                value2: e.target.value,
                rangeValidationResult: typeof rangeValidationResult === 'string' ? rangeValidationResult : ''
            });
        },
        render: function () {
            var me = this;
            var containerProp = cTools.containerBaseProps('dropdownlist', this, {
                merge: {onClick: this.onMainButtonClick},
                widthCorrect: -12
            });
            var label = this.___getValue___() || this.props.placeholder;
            label = label.replace(/-/g, '.').replace(/;/g, ' - ');
            var layerProp = {
                ref: 'layer',
                isOpen: this.state.layerOpen && !this.props.disabled,
                anchor: this.refs.container,
                closeWithBodyClick: true,
                onCloseByWindow: this.onCancelButtonClick,
                skin: this.context.appSkin ? (this.context.appSkin + '-normal') : 'normal'
            };
            var skin = this.props.skin ? this.props.skin : 'normal';
            skin = this.context.appSkin ? (this.context.appSkin + '-' + skin) : skin;
            containerProp.className += layerProp.isOpen ? (' fcui2-dropdownlist-' + skin + '-hover') : '';
            return (
                <div {...containerProp}>
                    <div className="icon-right font-icon font-icon-calendar"></div>
                    <span className="label-container">{label}</span>
                    <Layer {...layerProp}>{factory.layerContentFactory(me)}</Layer>
                </div>
            );
        }
    });

});

