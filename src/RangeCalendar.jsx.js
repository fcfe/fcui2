/**
 * @file 日期区间选择框组件
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.1
 */
define(function (require) {


    var React = require('react');
    var InputWidgetBase = require('./mixins/InputWidgetBase');
    var InputWidgetInForm = require('./mixins/InputWidgetInForm');
    var Layer = require('./Layer.jsx');
    var Calendar = require('./Calendar.jsx');
    var Button = require('./Button.jsx');


    var tools = require('./core/calendarTools');
    var util = require('./core/util');
    var language = require('./core/language').rangeCalendar;


    // 浮层弹出按钮
    return React.createClass({


        // @override
        mixins: [InputWidgetBase, InputWidgetInForm],


        // @override
        getDefaultProps: function () {
            return {
                className: '',
                minWidth: 100,
                width: NaN,
                placeholder: 'please select',
                min: '0-1-1',
                max: '9999-12-31',
                disabled: false,
                valueTemplate: '',
                /**
                 * 快捷按钮配置
                 * 两个日历上方的快捷按钮配置，按钮的一切都由外部导入，包括处理函数，元素格式如下：
                 * {label: '今天', getValues: function () {return {value1: new Date(), value2: new Date()};}}
                 */
                shortCut: [],
                // 时间跨度校验
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


        mainButtonClickHandler: function (e) {
            if (this.props.disabled) return;
            this.setState({layerOpen: true});
            // this.layerShow({
            //     value: this.___getValue___(),
            //     min: this.props.min,
            //     max: this.props.max,
            //     shortCut: this.props.shortCut,
            //     rangeValidator: this.props.rangeValidator,
            //     close: this.layerHide
            // }, true);
        },


        enterButtonClickHandler: function (e) {
            e.target = this.refs.container;
            e.target.value = this.state.value1 + ';' + this.state.value2;
            this.___dispatchChange___(e);
            this.setState({layerOpen: false});
        },


        cancelButtonClickHandler: function (e) {
            this.setState({layerOpen: false});
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


        shortCutFactory: function () {
            var shortCut = this.props.shortCut;
            if (!(shortCut instanceof Array) || shortCut.length === 0) return '';
            var doms = [];
            for (var i = 0; i < shortCut.length; i++) {
                var props = {
                    key: 'shortcut-' + i,
                    'data-ui-cmd': i,
                    onClick: this.shortCutClickHandler
                };
                doms.push(<div {...props}>{shortCut[i].label}</div>);
            }
            return doms;
        },


        layerContentFactory: function () {
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
            var enterButtonProp = {
                disabled: typeof this.state.rangeValidationResult === 'string'
                    && this.state.rangeValidationResult.length > 0,
                label: language.enter,
                skin: 'important',
                onClick: this.enterButtonClickHandler
            };
            return (
                <div className="fcui2-range-calendar">
                    <div className="fast-operation-bar">{this.shortCutFactory()}</div>
                    <div className="resuit-display-bar">
                        <div>{language.startTime + this.state.value1}</div>
                        <div>{language.endTime + this.state.value2}</div>
                    </div>
                    <Calendar {...c1Prop}/>
                    <Calendar {...c2Prop}/>
                    <div className="button-bar">
                        <Button {...enterButtonProp}/>
                        <Button label={language.cancel} onClick={this.cancelButtonClickHandler}/>
                        <span style={{position: 'relative', top: 0}}>{this.state.rangeValidationResult}</span>
                    </div>
                </div>
            );
        },


        render: function () {
            var me = this;
            var containerProp = {
                className: 'fcui2-dropdownlist ' + this.props.className,
                style: {
                    minWidth: this.props.minWidth,
                    borderColor: this.state.isValid === false ? '#F00' : undefined 
                },
                onClick: this.mainButtonClickHandler,
                ref: 'container'
            };
            if (this.props.disabled) {
                containerProp.className += ' fcui2-dropdownlist-disabled';
            }
            if (!isNaN(this.props.width)) {
                delete containerProp.style.minWidth;
                containerProp.style.width = this.props.width;
            }
            var label = this.___getValue___() || this.props.placeholder;
            label = label.replace(/-/g, '.').replace(/;/g, ' - ');
            var layerProp = {
                isOpen: this.state.layerOpen && !this.props.disabled,
                anchor: this.refs.container,
                closeWithBodyClick: true,
                onCloseByWindow: this.cancelButtonClickHandler
            };
            return (
                <div {...containerProp}>
                    <div className="icon-right font-icon font-icon-calendar"></div>
                    <div className="label-container">{label}</div>
                    <Layer {...layerProp}>{this.layerContentFactory()}</Layer>
                </div>
            );
        }
    });
});
