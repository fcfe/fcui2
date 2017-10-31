
define(function (require) {

    var React = require('react');
    var ProvinceRenderer = require('../components/region/NormalProvince.jsx');
    var RegionRenderer = require('../components/region/NormalRegion.jsx');
    var tools = require('../core/regionTools');

    return {
        rendererPropsFactory: function rendererPropsFactory(id, value, me) {
            return {
                key: id,
                id: id,
                value: value,
                parent: me,
                disabled: me.props.disabled,
                onChange: me.onRegionChange,
                type: me.props.type
            };
        },

        countryFactory: function countryFactory(arr, value, me) {
            value = tools.parseValue(value);
            var doms = [];
            var Renderer = typeof me.props.countryRenderer === 'function' ? me.props.countryRenderer : RegionRenderer;
            for (var i = 0; i < arr.length; i++) {
                doms.push(React.createElement(
                    'div',
                    { className: 'country-area', key: arr[i] },
                    me.props.regionFilter(arr[i]) === false ? null : React.createElement(Renderer, this.rendererPropsFactory(arr[i], value, me))
                ));
                doms = doms.concat(this.regionFactory(tools.filiation[arr[i]], value, me));
            }
            return doms;
        },

        regionFactory: function regionFactory(arr, value, me) {
            if (!arr) return '';
            var doms = [];
            var Renderer = typeof me.props.regionRenderer === 'function' ? me.props.regionRenderer : RegionRenderer;
            var tmpProvince = [];
            for (var i = 0; i < arr.length; i++) {
                var id = arr[i];
                if (tools.filiation.hasOwnProperty(id) && tools.filiation[id] instanceof Array) {
                    doms.push(React.createElement(
                        'div',
                        { key: arr[i], className: 'region-area' },
                        React.createElement(
                            'div',
                            { className: 'region-left-container' },
                            me.props.regionFilter(arr[i]) === false ? null : React.createElement(Renderer, this.rendererPropsFactory(id, value, me))
                        ),
                        React.createElement(
                            'div',
                            { className: 'region-right-container' },
                            this.provinceFactory(tools.filiation[id], value, me)
                        )
                    ));
                } else {
                    tmpProvince.push(this.provinceFactory([id], value, me));
                }
            }
            if (tmpProvince.length) {
                doms.push(React.createElement(
                    'div',
                    { key: arr.join('-'), className: 'region-area' },
                    tmpProvince
                ));
            }
            return doms;
        },

        provinceFactory: function provinceFactory(arr, value, me) {
            if (!arr) return '';
            var doms = [];
            var Renderer = typeof me.props.provinceRenderer === 'function' ? me.props.provinceRenderer : ProvinceRenderer;
            for (var i = 0; i < arr.length; i++) {
                if (me.props.regionFilter(arr[i]) !== false) {
                    doms.push(React.createElement(Renderer, this.rendererPropsFactory(arr[i], value, me)));
                }
            }
            return doms;
        }
    };
});