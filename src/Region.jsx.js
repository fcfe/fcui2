/**
 * @file 地域选择组件
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2
 */
define(function (require) {


    var React = require('react');
    var InputWidget = require('./mixins/InputWidget');


    var CheckBox = require('./CheckBox.jsx');
    var Radio = require('./Radio.jsx');
    var ProvinceRenderer = require('./components/region/NormalProvince.jsx');
    var RegionRenderer = require('./components/region/NormalRegion.jsx')


    var util = require('./core/util');
    var tools = require('./core/regionTools');
    var cTools = require('./core/componentTools');
    var language = require('./core/language').region;


    return React.createClass({
        // @override
        mixins: [InputWidget],
        // @override
        getDefaultProps: function () {
            return {
                skin: '',
                className: '',
                style: {},
                disabled: false,
                type: 'multi',
                provinceRenderer: ProvinceRenderer,
                regionRenderer: RegionRenderer,
                countryRenderer: RegionRenderer,
                valueTemplate: ''
            };
        },
        // @override
        getInitialState: function () {
            return {};
        },
        // @override
        componentDidMount: function () {
            this.___layerShow___ = '';
        },
        onRegionChange: function (e) {
            if (this.props.disabled) return;
            var value = this.___getValue___();
            value = this.props.type === 'single' ? {} : tools.parseValue(value);
            if (this.props.type === 'single') {
                value[e.target.value] = true;
            }
            else {
                if (e.target.checked) {
                    tools.addValue(e.target.value, value);
                }
                else {
                    tools.deleteValue(e.target.value, value);
                }
            }
            e.target = this.refs.container;
            e.target.value = tools.stringifyValue(value);
            this.___dispatchChange___(e);
        },
        render: function () { 
            return (
                <div {...cTools.containerBaseProps('region', this)}>
                    {countryFactory([998, 999], this.___getValue___(), this)}
                </div>
            );
        }
    });

    
    function rendererPropsFactory(id, value, me) {
        return {
            key: id,
            id: id,
            value: value,
            parent: me,
            disabled: me.props.disabled,
            onChange: me.onRegionChange,
            type: me.props.type
        };
    }


    function countryFactory(arr, value, me) {
        value = tools.parseValue(value);
        var doms = [];
        var Renderer = typeof me.props.countryRenderer === 'function' ? me.props.countryRenderer : RegionRenderer;
        for (var i = 0; i < arr.length; i++) {
            doms.push(
                <div key={arr[i]} className="country-area">
                    <div className="country-title">
                        <Renderer {...rendererPropsFactory(arr[i], value, me)} />
                    </div>
                    <div>
                        {regionFactory(tools.filiation[arr[i]], value, me)}
                    </div>
                </div>
            );
        }
        return doms;
    }


    function regionFactory(arr, value, me) {
        if (!arr) return '';
        var doms = [];
        var Renderer = typeof me.props.regionRenderer === 'function' ? me.props.regionRenderer : RegionRenderer;
        for (var i = 0; i < arr.length; i++) {
            doms.push(
                <div key={arr[i]} className="region-area">
                    <div className="region-left-container">
                        <Renderer {...rendererPropsFactory(arr[i], value, me)}/>
                    </div>
                    <div className="region-right-container">
                       {provinceFactory(tools.filiation[arr[i]], value, me)}
                    </div>
                </div>
            );
        }
        return doms;
    }


    function provinceFactory(arr, value, me) {
        if (!arr) return '';
        var doms = [];
        var Renderer = typeof me.props.provinceRenderer === 'function' ? me.props.provinceRenderer : ProvinceRenderer;
        for (var i = 0; i < arr.length; i++) {
            doms.push(<Renderer {...rendererPropsFactory(arr[i], value, me)} />);
        }
        return doms;
    }


});
