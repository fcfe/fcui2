
define(function (require) {

    var React = require('react');
    var CheckBox = require('../CheckBox.jsx');
    var tools = require('../core/scheduleTools');
    var language = require('../core/language').schedule;

    return {

        gridFactory: function (me) {
            var grid = [];
            for (var i = 0; i < 7; i++) {
                for (var j = 0; j < 24; j++) {
                    var props = {
                        type: 'grid',
                        axis: {
                            x: (j + '') * 1,
                            y: (i + '') * 1
                        },
                        key: j + '-' + i,
                        style: {left: j * 24, top: i * 24}
                    };
                    typeof me.props.prepare === 'function' && me.props.prepare(props);
                    grid.push(<div {...props}></div>);
                }
            }
            return grid;
        },

        axisXFactory: function () {
            var doms = [];
            for (var i = 0; i <= 24; i++) {
                doms.push(<div key={i}>{i}</div>);
            }
            return doms;
        },

        axisYFactory: function (me) {
            var doms = [];
            var flag = me.props.flags && me.props.flags.hasOwnProperty('enableRowSelector')
                ? me.props.flags.enableRowSelector : true;
            var value = me.___getValue___();
            if (flag) {
                for (var i = 0; i < 7; i++) {
                    var selected = tools.getRangeSelectedCount(value, {x: 0, y: i}, {x: 24, y: i});
                    var prop = {
                        disabled: me.props.disabled,
                        label: language.day[i],
                        labelPosition: 'right',
                        key: i,
                        value: i,
                        indeterminate: selected > 0,
                        checked: selected === 24,
                        style: {top: i * 24},
                        onChange: me.onSelectRow
                    };
                    doms.push(<CheckBox {...prop}/>);
                }
                return doms;
            }
            for (var i = 0; i < 7; i++) {
                doms.push(
                    <div key={i} className="fcui2-checkbox disabled-selected" style={{top: i * 24}}>
                        {language.day[i]}
                    </div>
                );
            }
            return doms;
        },

        columnSelectorFactory: function (me) {
            var flag = me.props.flags && me.props.flags.hasOwnProperty('enableColumnSelector')
                ? me.props.flags.enableColumnSelector : true;
            if (!flag) return null;
            var doms = [];
            var value = me.___getValue___();
            for (var i = 0; i < 24; i++) {
                var selected = tools.getRangeSelectedCount(value, {x: i, y: 0}, {x: i, y: 6});
                var prop = {
                    disabled: me.props.disabled,
                    label: '',
                    key: i,
                    value: i,
                    indeterminate: selected > 0,
                    checked: selected === 7,
                    onChange: me.onSelectColumn
                };
                doms.push(<CheckBox {...prop}/>);
            }
            return (<div className="column-selector-area">{doms}</div>);
        }
    };
});
