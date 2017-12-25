define(function (require) {

    var React = require('react');
    var tool = require('../core/calendarTools');
    var Button = require('../Button.jsx');
    var NumberBox = require('../NumberBox.jsx');

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
        },

        normalOperationBarFactory: function (me) {
            var skin = me.props.skin ? me.props.skin : 'normal';
            skin = me.context.appSkin ? (me.context.appSkin + '-' + skin) : skin;
            var subBtnProp = {
                icon: 'fcui2-icon fcui2-icon-arrow-left',
                label: '',
                iconLeft: 5,
                onClick: me.onMonthSub,
                disabled: me.props.disabled,
                skin: skin
            };
            var yearInputProp = {
                ref: 'inputYear',
                min: 0,
                max: 9999,
                onChange: me.onYearChange,
                value: me.state.inputYear,
                type: 'int',
                style: {width: 75, left: 43},
                skin: skin
            };
            var monthInputProp = {
                ref: 'inputMonth',
                min: 1,
                max: 12,
                onChange: me.onMonthChange,
                value: me.state.inputMonth,
                type: 'int',
                style: {width: 60, right: 43},
                skin: skin
            };
            var addBtnProp = {
                icon: 'fcui2-icon fcui2-icon-arrow-right',
                label: '',
                iconLeft: 7,
                onClick: me.onMonthAdd,
                disabled: me.props.disabled,
                skin: skin
            };
            return (
                <div className="calendar-operation">
                    <Button {...subBtnProp}/>
                    <NumberBox {...yearInputProp} disabled={me.props.disabled}/>
                    <NumberBox {...monthInputProp} disabled={me.props.disabled}/>
                    <Button {...addBtnProp}/>
                </div>
            );
        },

        oneux4OperationBarFactory: function (me) {
            var skin = me.props.skin ? me.props.skin : 'normal';
            skin = me.context.appSkin ? (me.context.appSkin + '-' + skin) : skin;
            var subYearBtnProp = {
                icon: 'fcui2-icon fcui2-icon-arrow-left-2',
                label: '',
                iconLeft: 5,
                style: {left: 0},
                onClick: function () {
                    var year = me.state.displayYear;
                    if (isNaN(year)) return;
                    me.onYearChange({
                        target: {value: year * 1 - 1}
                    });
                },
                disabled: me.props.disabled,
                skin: skin
            };
            var subMonthBtnProp = {
                icon: 'fcui2-icon fcui2-icon-arrow-left',
                label: '',
                iconLeft: 5,
                onClick: me.onMonthSub,
                disabled: me.props.disabled,
                style: {left: 32},
                skin: skin
            };
            var yearInputProp = {
                ref: 'inputYear',
                min: 0,
                max: 9999,
                showSpinButton: false,
                onChange: me.onYearChange,
                value: me.state.inputYear,
                type: 'int',
                style: {width: 55, left: 65},
                skin: skin
            };
            var monthInputProp = {
                ref: 'inputMonth',
                min: 1,
                max: 12,
                showSpinButton: false,
                onChange: me.onMonthChange,
                value: me.state.inputMonth,
                type: 'int',
                style: {width: 38, right: 64},
                skin: skin
            };
            var addMonthBtnProp = {
                icon: 'fcui2-icon fcui2-icon-arrow-right',
                label: '',
                iconLeft: 7,
                style: {right: 29},
                onClick: me.onMonthAdd,
                disabled: me.props.disabled,
                skin: skin
            };
            var addYearBtnProp = {
                icon: 'fcui2-icon fcui2-icon-arrow-right-2',
                label: '',
                iconLeft: 7,
                style: {right: 2},
                onClick: function () {
                    var year = me.state.displayYear;
                    if (isNaN(year)) return;
                    me.onYearChange({
                        target: {value: year * 1 + 1}
                    });
                },
                disabled: me.props.disabled,
                skin: skin
            };
            return (
                <div className="calendar-operation">
                    <Button {...subYearBtnProp}/>
                    <Button {...subMonthBtnProp}/>
                    <NumberBox {...yearInputProp} disabled={me.props.disabled}/>
                    <NumberBox {...monthInputProp} disabled={me.props.disabled}/>
                    <Button {...addMonthBtnProp}/>
                    <Button {...addYearBtnProp}/>
                </div>
            );
        }
    };

})
