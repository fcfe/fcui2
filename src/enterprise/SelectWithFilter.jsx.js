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
    var _ = require('underscore');

    var defaultFilter = function (datasource, filter) {
        filter = filter.trim();
        var filteredData = [];
        if (filter.length > 0) {
            for (var i = 0; i < datasource.length; i++) {
                if (datasource[i].label.indexOf(filter) > -1) {
                    filteredData.push(datasource[i]);
                }
            }
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
                // filter
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
                style: {
                    maxHeight: '280px',
                    overflow: 'hidden'
                }
            };

            var filter = this.state.filter;
            var datasource = typeof this.props.defaultFilter === 'function'
                ? this.props.defaultFilter(this.props.datasource, filter)
                : defaultFilter(this.props.datasource, filter);
            var listProp = {
                datasource: datasource instanceof Array ? datasource : [],
                ref: 'list',
                onClick: this.onListClick
            };
            var searchProp = {
                placeholder: this.props.searchPlaceholder,
                value: filter,
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
            containerProp.className += layerProp.isOpen ? ' fcui2-dropdownlist-hover' : '';

            return (
                <div {...containerProp}>
                    <div className="icon-right font-icon font-icon-largeable-caret-down"></div>
                    <span className="label-container">{label}</span>
                    <Layer {...layerProp}>
                        <div className="fcui2-filter-select-layer-content">
                            <div className="filter-select-box">
                                <SearchBox {...searchProp} />
                            </div>
                            <div className="filter-select-list">
                                <List {...listProp} />
                            </div>
                        </div>
                    </Layer>
                </div>
            );
        }
    });
});
