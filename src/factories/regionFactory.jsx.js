
define(function (require) {

    var React = require('react');
    var ProvinceRenderer = require('../components/region/NormalProvince.jsx');
    var RegionRenderer = require('../components/region/NormalRegion.jsx')
    var tools = require('../core/regionTools');

    return {
        rendererPropsFactory: function (id, value, me) {
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

        countryFactory: function (arr, value, me) {
            value = tools.parseValue(value);
            var doms = [];
            var Renderer = typeof me.props.countryRenderer === 'function' ? me.props.countryRenderer : RegionRenderer;
            for (var i = 0; i < arr.length; i++) {
                doms.push(
                    <div className="country-area" key={arr[i]}>
                        <Renderer {...this.rendererPropsFactory(arr[i], value, me)} />
                    </div>
                );
                doms = doms.concat(this.regionFactory(tools.filiation[arr[i]], value, me));
            }
            return doms;
        },

        regionFactory: function (arr, value, me) {
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
                                <Renderer {...this.rendererPropsFactory(id, value, me)}/>
                            </div>
                            <div className="region-right-container">
                               {this.provinceFactory(tools.filiation[id], value, me)}
                            </div>
                        </div>
                    );
                }
                else {
                    tmpProvince.push(this.provinceFactory([id], value, me));
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
        },

        provinceFactory: function (arr, value, me) {
            if (!arr) return '';
            var doms = [];
            var Renderer = typeof me.props.provinceRenderer === 'function' ? me.props.provinceRenderer : ProvinceRenderer;
            for (var i = 0; i < arr.length; i++) {
                doms.push(<Renderer {...this.rendererPropsFactory(arr[i], value, me)} />);
            }
            return doms;
        }
    };

});
