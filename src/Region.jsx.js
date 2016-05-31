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
                noLinkage: false,
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
                    tools.addValue(e.target.value, value, this.props.noLinkage);
                }
                else {
                    tools.deleteValue(e.target.value, value, this.props.noLinkage);
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
                <div className="country-area" key={arr[i]}>
                    <Renderer {...rendererPropsFactory(arr[i], value, me)} />
                </div>
            );
            doms = doms.concat(regionFactory(tools.filiation[arr[i]], value, me));
        }
        return doms;
    }


    function regionFactory(arr, value, me) {
        if (!arr) return '';
        var doms = [];
        var Renderer = typeof me.props.regionRenderer === 'function' ? me.props.regionRenderer : RegionRenderer;
        var tmpProvince = [];
        for (var i = 0; i < arr.length; i++) {
            var id = arr[i];
            if (tools.filiation.hasOwnProperty(id) && tools.filiation[id] instanceof Array) {
                doms.push(
                    <div key={arr[i]} className="region-area">
                        <div className="region-left-container">
                            <Renderer {...rendererPropsFactory(id, value, me)}/>
                        </div>
                        <div className="region-right-container">
                           {provinceFactory(tools.filiation[id], value, me)}
                        </div>
                    </div>
                );
            }
            else {
                tmpProvince.push(provinceFactory([id], value, me));
            }
        }
        if (tmpProvince.length) {
            doms.push(
                <div key={arr.join('-')} className="region-area">
                    {tmpProvince}
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
