
define(function (require) {

    var React = require('react');

    var Calendar = require('../Calendar.jsx');
    var Button = require('../Button.jsx');

    var tools = require('../core/calendarTools');
    var util = require('../core/util');
    var language = require('../core/language').rangeCalendar;

    return {
        layerContentFactory: function layerContentFactory(me) {
            var tpl = 'YYYY-MM-DD';
            var min = tools.str2date(me.props.min) || tools.str2date('0-1-1');
            var max = tools.str2date(me.props.max) || tools.str2date('9999-12-31');
            if (tools.compareDate(min, max) === 1) {
                // min > max
                var tmp = min;
                min = max;
                max = tmp;
            }
            var c1Prop = {
                ref: 'c1',
                className: 'left-calendar',
                min: util.dateFormat(min, tpl),
                value: me.state.value1,
                max: util.dateFormat(me.state.value2, tpl),
                onChange: me.onCalendarChange1
            };
            var c2Prop = {
                ref: 'c2',
                className: 'right-calendar',
                min: util.dateFormat(me.state.value1, tpl),
                value: me.state.value2,
                max: util.dateFormat(max, tpl),
                onChange: me.onCalendarChange2
            };
            var enterButtonProp = {
                ref: 'enterButton',
                disabled: typeof me.state.rangeValidationResult === 'string' && me.state.rangeValidationResult.length > 0,
                label: language.enter,
                skin: 'important',
                onClick: me.onEnterButtonClick
            };
            var shorts = this.shortCutFactory(me);
            return React.createElement(
                'div',
                { className: 'fcui2-range-calendar' },
                shorts.length ? React.createElement(
                    'div',
                    { className: 'fast-operation-bar' },
                    shorts
                ) : null,
                React.createElement(
                    'div',
                    { className: 'resuit-display-bar' },
                    React.createElement(
                        'div',
                        null,
                        language.startTime + me.state.value1
                    ),
                    React.createElement(
                        'div',
                        null,
                        language.endTime + me.state.value2
                    )
                ),
                React.createElement(Calendar, c1Prop),
                React.createElement(Calendar, c2Prop),
                React.createElement(
                    'div',
                    { className: 'button-bar' },
                    React.createElement(Button, enterButtonProp),
                    React.createElement(Button, { ref: 'cancelButton', label: language.cancel, onClick: me.onCancelButtonClick }),
                    React.createElement(
                        'span',
                        { style: { position: 'relative', top: 0 } },
                        me.state.rangeValidationResult
                    )
                )
            );
        },
        shortCutFactory: function shortCutFactory(me) {
            var shortCut = me.props.shortCut;
            if (!(shortCut instanceof Array) || shortCut.length === 0) return '';
            var doms = [];
            for (var i = 0; i < shortCut.length; i++) {
                var dataRange = shortCut[i].getValues();
                var selected = util.dateFormat(dataRange.value1, 'YYYY-MM-DD') === me.state.value1 && util.dateFormat(dataRange.value2, 'YYYY-MM-DD') === me.state.value2;
                var props = {
                    className: selected ? 'selected-region' : '',
                    key: 'shortcut-' + i,
                    'data-ui-cmd': i,
                    onClick: me.onShortCutClick
                };
                doms.push(React.createElement(
                    'div',
                    props,
                    shortCut[i].label
                ));
            }
            return doms;
        }
    };
});