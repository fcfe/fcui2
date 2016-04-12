/**
 * @file 地域选择组件
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.1
 */
define(function (require) {


    var React = require('react');
    var InputWidgetBase = require('./mixins/InputWidgetBase');
    var InputWidgetInForm = require('./mixins/InputWidgetInForm');
    var CheckBox = require('./CheckBox.jsx');
    var RegionProvince = require('./components/region/NormalProvince.jsx');


    var util = require('./core/util');
    var tools = require('./core/regionTools');
    var language = require('./core/language').region;


    return React.createClass({
        // @override
        mixins: [InputWidgetBase, InputWidgetInForm],
        // @override
        getDefaultProps: function () {
            return {
                className: '',
                disabled: false,
                provinceRenderer: RegionProvince,
                valueTemplate: ''
            };
        },
        // @override
        getInitialState: function () {
            return {};
        },
        changeHandler: function (e) {
            if (this.props.disabled) return;
            var value = this.___getValue___();
            value = tools.parseValue(value);
            if (e.target.checked) {
                tools.addValue(e.target.value, value);
            }
            else {
                tools.deleteValue(e.target.value, value);
            }
            e.target = this.refs.container;
            e.target.value = tools.stringifyValue(value);
            this.___dispatchChange___(e);
        },
        render: function () {
            var value = this.___getValue___();
            return (
                <div className={'fcui2-region ' + this.props.className} ref="container">
                    {countryFactory([90, 999, 0], value, this)}
                </div>
            );
        }
    });


    function checkboxFactory(id, value, me) {
        var selected = tools.getSelectedState(id, value);
        var prop = {
            label: language.regionName[id],
            labelPosition: 'right',
            value: id,
            disabled: me.props.disabled,
            checked: selected.checked,
            indeterminate: selected.indeterminate,
            onChange: me.changeHandler
        };
        return <CheckBox {...prop}/>;
    }


    function countryFactory(arr, value, me) {
        value = tools.parseValue(value);
        var doms = [];
        for (var i = 0; i < arr.length; i++) {
            doms.push(
                <div key={arr[i]} className="country-area">
                    <div className="country-title">{checkboxFactory(arr[i], value, me)}</div>
                    <div>{regionFactory(tools.filiation[arr[i]], value, me)}</div>
                </div>
            );
        }
        return doms;
    }


    function regionFactory(arr, value, me) {
        if (!arr) return '';
        var doms = [];
        for (var i = 0; i < arr.length; i++) {
            doms.push(
                <div key={arr[i]} className="region-area">
                    <div className="region-left-container">{checkboxFactory(arr[i], value, me)}</div>
                    <div className="region-right-container">{provinceFactory(tools.filiation[arr[i]], value, me)}</div>
                </div>
            );
        }
        return doms;
    }


    function provinceFactory(arr, value, me) {
        if (!arr) return '';
        var doms = [];
        var renderer = typeof me.props.provinceRenderer === 'function' ? me.props.provinceRenderer : RegionProvince;
        for (var i = 0; i < arr.length; i++) {
            var prop = {
                key: arr[i],
                id: arr[i],
                value: value,
                parent: me,
                disabled: me.props.disabled,
                onChange: me.changeHandler
            }
            doms.push(React.createElement(renderer, prop));
        }
        return doms;
    }


});
