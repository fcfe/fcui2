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
    var Calendar = require('./Calendar.jsx');
    var Button = require('./Button.jsx');


    var cTools = require('./core/componentTools');
    var tools = require('./core/calendarTools');
    var util = require('./core/util');
    var language = require('./core/language').rangeCalendar;


    // 浮层弹出按钮
    return React.createClass({
        /**
         * @properties
         *
         * @param {Import|Properties} src\core\componentTools.js skin className style disabled
         * @param {String} placeholder 弹出按钮默认显示的文字，如果选择了日期区间，则此项不显示
         * @param {String} max 日历最大值，在这一天之后的日期不能被选定，格式：YYYY-MM-DD
         * @param {String} min 日历最小值，在这一天之前的日期不能被选定，格式：YYYY-MM-DD
         * @param {Array.<RangeCalendarShortCut>} shortCut 快捷选择按钮配置
         * @param {Function} rangeValidator 日期区间校验机
         * @param {Import|Properties} src\mixins\InputWidget.js
         *      value onChange name validations customErrorTemplates valueLink valueTemplate
         */
        /**
         * @structure RangeCalendarShortCut
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
        propTypes: {
            // base
            skin: React.PropTypes.string,
            className: React.PropTypes.string,
            style: React.PropTypes.object,
            disabled: React.PropTypes.bool,
            // self
            placeholder: React.PropTypes.string,
            max: React.PropTypes.string,
            min: React.PropTypes.string,
            shortCut: React.PropTypes.array,
            rangeValidator: React.PropTypes.func,
            // mixin
            value: React.PropTypes.string,
            valueLink: React.PropTypes.object,
            name: React.PropTypes.string,
            onChange: React.PropTypes.func,
            validations: React.PropTypes.object,
            customErrorTemplates: React.PropTypes.object,
            valueTemplate: React.PropTypes.string
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
                placeholder: 'please select',
                min: '0-1-1',
                max: '9999-12-31',
                valueTemplate: '',
                shortCut: [],
                rangeValidator: function () {}
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
                merge: {
                    onClick: this.onMainButtonClick
                }
            });
            var label = this.___getValue___() || this.props.placeholder;
            label = label.replace(/-/g, '.').replace(/;/g, ' - ');
            var layerProp = {
                isOpen: this.state.layerOpen && !this.props.disabled,
                anchor: this.refs.container,
                closeWithBodyClick: true,
                onCloseByWindow: this.onCancelButtonClick
            };
            return (
                <div {...containerProp}>
                    <div className="icon-right font-icon font-icon-calendar"></div>
                    <div className="label-container">{label}</div>
                    <Layer {...layerProp}>{layerContentFactory(me)}</Layer>
                </div>
            );
        }
    });


    function layerContentFactory(me) {
        var tpl = 'YYYY-MM-DD';
        var min = tools.str2date(me.props.min) || tools.str2date('0-1-1');
        var max = tools.str2date(me.props.max) || tools.str2date('9999-12-31');
        if (tools.compareDate(min, max) === 1) { // min > max
            var tmp = min;
            min = max;
            max = tmp;
        }
        var c1Prop = {
            ref: 'c1',
            min: util.dateFormat(min, tpl),
            value: me.state.value1,
            max: util.dateFormat(me.state.value2, tpl),
            onChange: me.onCalendarChange1
        };
        var c2Prop = {
            ref: 'c2',
            min: util.dateFormat(me.state.value1, tpl),
            value: me.state.value2,
            max: util.dateFormat(max, tpl),
            onChange: me.onCalendarChange2
        };
        var enterButtonProp = {
            disabled: typeof me.state.rangeValidationResult === 'string'
                && me.state.rangeValidationResult.length > 0,
            label: language.enter,
            skin: 'important',
            onClick: me.onEnterButtonClick
        };
        return (
            <div className="fcui2-range-calendar">
                <div className="fast-operation-bar">{shortCutFactory(me)}</div>
                <div className="resuit-display-bar">
                    <div>{language.startTime + me.state.value1}</div>
                    <div>{language.endTime + me.state.value2}</div>
                </div>
                <Calendar {...c1Prop}/>
                <Calendar {...c2Prop}/>
                <div className="button-bar">
                    <Button {...enterButtonProp}/>
                    <Button label={language.cancel} onClick={me.onCancelButtonClick}/>
                    <span style={{position: 'relative', top: 0}}>{me.state.rangeValidationResult}</span>
                </div>
            </div>
        );
    }


    function shortCutFactory(me) {
        var shortCut = me.props.shortCut;
        if (!(shortCut instanceof Array) || shortCut.length === 0) return '';
        var doms = [];
        for (var i = 0; i < shortCut.length; i++) {
            var props = {
                key: 'shortcut-' + i,
                'data-ui-cmd': i,
                onClick: me.onShortCutClick
            };
            doms.push(<div {...props}>{shortCut[i].label}</div>);
        }
        return doms;
    }


});

