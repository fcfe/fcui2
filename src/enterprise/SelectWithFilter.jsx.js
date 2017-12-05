/**
 * 带搜索框的选择器
 * @author Brian Li, hancong05
 * @version 0.0.2.1
 */
define(function (require) {


    var React = require('react');
    var InputWidget = require('../mixins/InputWidget');
    
    var Layer = require('../Layer.jsx');
    var List = require('../List.jsx');
    var SearchBox = require('../SearchBox.jsx');
    var cTools = require('../core/componentTools');


    var defaultFilter = function (datasource, filter) {
        filter = filter.trim();
        var filteredData = [];
        if (filter.length > 0) {
            datasource.map(function (item) {
                if (typeof item.label === 'string' && item.label.indexOf(filter) > -1) {
                    filteredData.push(item);
                }
            });
        }
        else {
            filteredData = datasource;
        }
        return filteredData;
    };


    return React.createClass({
        /**
         * @properties
         *
         * @param {Import|Properties} src\core\componentTools.js skin className style disabled
         * @param {String} placeholder 组件为选择且无初始值时，下拉按钮上显示的值
         * @param {String} openLayerType 控制浮层打开的动作，onMouseEnter或onClick
         * @param {Array.<ListItemObject>} datasource 列表数据源
         * @param {String} searchPlaceholder 搜索框placeholder
         * @param {Function} defaultFilter 搜索数据的方法，默认灌入两个参数：(数据源, 过滤字符串)，返回过滤后的数组，
         * @param {Import|Properties} src\mixins\InputWidget.js
         *      value onChange name validations customErrorTemplates valueTemplate
         */
        /**
         * @structure Import src\List.jsx.js ListItemObject
         */
        /**
         * @fire Import src\mixins\InputWidget.js XXX onChange
         */
        // @override
        contextTypes: {
            appSkin: React.PropTypes.string
        },
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
                // mixin
                placeholder: 'please select',
                openLayerType: 'onMouseEnter',
                defaultFilter: defaultFilter,
                datasource: [],
                // mixin
                valueTemplate: ''
            };
        },
        // @override
        getInitialState: function () {
            return {
                layerOpen: false,
                mouseenter: false,
                filter: ''
            };
        },
        onListClick: function (e) {
            var value = this.___getValue___();
            if (this.props.disabled || value === e.target.value) return;
            this.___dispatchChange___(e);
            this.setState({layerOpen: false});
        },
        onFilterChange: function (e) {
            this.setState({
                filter: e.target.value
            });
        },
        onMouseEnter: function () {
            this.setState({
                mouseenter: true,
                layerOpen: true
            });
        },
        onMouseLeave: function () {
            this.setState({mouseenter: false});
            cTools.closeLayerHandlerFactory(this, 'layerOpen')();
        },
        render: function () {
            var me = this;
            var label = this.props.placeholder;
            var value = this.___getValue___();
            var containerProp = cTools.containerBaseProps('dropdownlist', this, {
                widthCorrect: -12
            });
            var layerProp = {
                ref: 'layer',
                isOpen: this.state.layerOpen && this.props.datasource.length && !this.props.disabled,
                anchor: this.refs.container,
                onMouseLeave: cTools.closeLayerHandlerFactory(this, 'layerOpen'),
                skin: this.context.appSkin ? (this.context.appSkin + '-normal') : 'normal'
            };
            var filter = typeof this.props.defaultFilter === 'function' ? this.props.defaultFilter : defaultFilter;
            var datasource = filter(this.props.datasource, this.state.filter);
            var listProp = {
                datasource: datasource instanceof Array ? datasource : [],
                ref: 'list',
                onClick: this.onListClick,
                style: {
                    maxHeight: '242px',
                    minWidth: '200px',
                    overflowY: 'auto',
                    overflowX: 'hidden'
                }
            };
            var searchProp = {
                placeholder: this.props.searchPlaceholder,
                value: this.state.filter,
                onChange: this.onFilterChange
            };
            containerProp[this.props.openLayerType] = this.onMouseEnter;
            containerProp.onMouseLeave = this.onMouseLeave;
            for (var i = 0; i < this.props.datasource.length; i++) {
                if (this.props.datasource[i].value + '' === value + '') {
                    label = this.props.datasource[i].label;
                    break;
                }
            }
            var skin = this.props.skin ? this.props.skin : 'normal';
            skin = this.context.appSkin ? (this.context.appSkin + '-' + skin) : skin;
            containerProp.className += layerProp.isOpen ? (' fcui2-dropdownlist-' + skin + '-hover') : '';
            return (
                <div {...containerProp}>
                    <div className="icon-right fcui2-icon fcui2-icon-arrow-down"></div>
                    <span className="label-container">{label}</span>
                    <Layer {...layerProp}>
                        <div className="fcui2-filter-select-layer-content">
                            <div className="filter-select-box">
                                <SearchBox {...searchProp} />
                            </div>
                            {
                                datasource.length ? (
                                    <div className="filter-select-list">
                                        <List {...listProp} />
                                    </div>
                                ) : null
                            }
                        </div>
                    </Layer>
                </div>
            );
        }
    });
});
