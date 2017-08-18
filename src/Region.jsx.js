/**
 * 地域选择器
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2.1
 */
define(function (require) {


    var React = require('react');
    var InputWidget = require('./mixins/InputWidget');
    var ProvinceRenderer = require('./components/region/NormalProvince.jsx');
    var RegionRenderer = require('./components/region/NormalRegion.jsx')

    var tools = require('./core/regionTools');
    var cTools = require('./core/componentTools');
    var factory = require('./factories/regionFactory.jsx');

    return React.createClass({
        /**
         * @properties
         *
         * @param {Import|Properties} src\core\componentTools.js skin className style disabled
         * @param {String} type 工作模式，如果是'single'标识单选，否则为多选
         * @param {Boolean} noLinkage 是否关闭联动选择，如果关闭将打断地域间的联带关系
         * @param {ReactClass} provinceRenderer 省渲染器
         * @param {ReactClass} regionRenderer 地区渲染器
         * @param {ReactClass} countryRenderer 国家渲染器
         * @param {Array} countries 需要显示的国家，默认全部(中国和国外)
         * @param {Import|Properties} src\mixins\InputWidget.js
         *      value onChange name validations customErrorTemplates valueTemplate
         */
        /**
         * @fire Import src\mixins\InputWidget.js XXX onChange
         */
        // @override
        mixins: [InputWidget],
        // @override
        getDefaultProps: function () {
            return {
                // base
                skin: '',
                className: '',
                style: {},
                disabled: false,
                // self
                type: 'multi',
                noLinkage: false,
                provinceRenderer: ProvinceRenderer,
                regionRenderer: RegionRenderer,
                countryRenderer: RegionRenderer,
                countries: [998, 999],
                regionFilter: () => true,
                // mixin
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
                    {factory.countryFactory(this.props.countries, this.___getValue___(), this)}
                </div>
            );
        }
    });


});
