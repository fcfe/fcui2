define(function (require) {

    var React = require('react');
    var tool = require('../core/calendarTools');
    var Button = require('../Button.jsx');

    return {

        dayLabelFactory: function (v) {
            return <div key={'day-' + v}>{v}</div>;
        },

        buttonPropsFactory: function (timer, disabled, key, skin) {
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
        },

        buttonFactory: function (me) {

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
                buttons.push(<Button {...this.buttonPropsFactory(tmpTimer, true, buttons.length)}/>);
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
                buttons.push(<Button {...this.buttonPropsFactory(tmpTimer, disabled, buttons.length, skin)} {...props}/>);
                tmpTimer.setDate(tmpTimer.getDate() + 1);
            }

            // 导入本月后的日期
            while(buttons.length < 42) {
                buttons.push(<Button {...this.buttonPropsFactory(tmpTimer, true, buttons.length)}/>);
                tmpTimer.setDate(tmpTimer.getDate() + 1);
            }
       
            return buttons;
        }
    };

});
