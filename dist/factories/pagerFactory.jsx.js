var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

define(function (require) {

    var React = require('react');
    var Button = require('../Button.jsx');
    var NumberBox = require('../NumberBox.jsx');
    var language = require('../core/language');

    return {

        buttonFactory: function buttonFactory(me) {
            var min = parseInt(me.props.min, 10);
            var max = parseInt(me.props.max, 10);
            var threshold = parseInt(me.props.threshold, 10);
            var btns = [];
            var value = parseInt(me.___getValue___(), 10);

            value = isNaN(value) ? min : value;
            value = value < min ? min : value;
            value = value > max ? max : value;
            threshold = isNaN(threshold) || threshold < 1 ? Number.POSITIVE_INFINITY : threshold;

            btns.push(React.createElement(Button, { label: language.pager.previousPage, value: 'prev', className: 'pager-btn',
                onClick: me.onButtonClick, disabled: me.props.disabled || value <= min, key: 'prev' }));

            var i = min;
            var before = false;
            var after = false;
            while (i < max + 1) {
                if (i < value - threshold && i !== min) {
                    if (!before) {
                        before = true;
                        btns.push(React.createElement(Button, _extends({}, prop, { label: '..', value: value - threshold - 1, key: value - threshold - 1 })));
                    }
                    i++;
                    continue;
                }
                if (i > value + threshold && i !== max) {
                    if (!after) {
                        after = true;
                        btns.push(React.createElement(Button, _extends({}, prop, { label: '..', value: value + threshold + 1, key: value + threshold + 1 })));
                    }
                    i++;
                    continue;
                }
                var prop = {
                    skin: i + '' === value + '' ? 'active' : '',
                    minWidth: 12,
                    disabled: me.props.disabled,
                    onClick: me.onButtonClick
                };
                btns.push(React.createElement(Button, _extends({}, prop, { label: i + '', value: i, key: i })));
                i++;
            }

            btns.push(React.createElement(Button, { label: language.pager.nextPage, value: 'next', className: 'pager-btn',
                onClick: me.onButtonClick, disabled: me.props.disabled || value >= max, key: 'next' }));

            return btns;
        },
        pageJumperFactory: function pageJumperFactory(me) {
            var showPageJumper = me.props.showPageJumper;
            if (!showPageJumper) {
                return null;
            }
            // 如果显示跳转输入框
            var min = parseInt(me.props.min, 10);
            var max = parseInt(me.props.max, 10);
            var current = parseInt(me.___getValue___(), 10);
            var pageJumperProps = {
                width: 50,
                height: 28,
                showSpinButton: false,
                valueTemplate: current,
                type: 'int',
                min: min,
                max: max,
                onChange: me.onPagerChange
            };

            return React.createElement(
                'span',
                { className: 'page-jumper' },
                '\u53BB\u7B2C',
                React.createElement(NumberBox, pageJumperProps),
                '\u9875'
            );
        }
    };
});