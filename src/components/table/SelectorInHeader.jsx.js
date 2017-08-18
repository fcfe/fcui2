/**
 * Table 有选择功能的表头渲染器
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2.1
 */
define(function (require) {


    var React = require('react');
    var language = require('../../core/language');
    var Layer = require('../../Layer.jsx');
    var List = require('../../List.jsx');
    var cTools = require('../../core/componentTools');
    var tools = require('../../core/tableTools');


    var SELECT_MODE = {
        CURRENT_PAGE: '2',
        ALL: '3'
    };
    var SELECT_COMMAND = {
        CURRENT_PAGE: '-2',
        CLEAR: '-3'
    };


    function getInformationFromTable(table) {
        var selected = tools.getSelectedHash(table.___getValue___());
        return {
            i: tools.getSelectedCount(selected),
            workMode: table.props.flags.showSelector + ''
        }
    }


    return React.createClass({
        contextTypes: {
            appSkin: React.PropTypes.string
        },
        // @override
        getDefaultProps: function () {
            /**
             * @properties
             * @param {Object} fieldConfig 当前列配置
             * @param {ReactComponent} tableComponent table实例对象
             * @param {Array.<ListItemObject>} datasource 选择器下拉菜单数据源
             */
            return {
                fieldConfig: {},
                tableComponent: {},
                datasource: [
                    {label: language.tableSelector.selectCurrentPage, value: '-2'},
                    {label: language.tableSelector.selectAll, value: '-1'}
                ]
            };
        },
        // @override
        getInitialState: function () {
            return {
                layerOpen: false
            };
        },
        onListClick: function (e) {
            this.setState({layerOpen: false});
            this.props.tableComponent.onRowSelect(e);
        },
        onMainSelectorChange: function (e) {
            var table = this.props.tableComponent;
            var info = getInformationFromTable(table);
            e.target = this.refs.container;
            if (info.workMode === SELECT_MODE.CURRENT_PAGE) {
                e.target.value = info.i === table.props.datasource.length
                    ? SELECT_COMMAND.CLEAR : SELECT_COMMAND.CURRENT_PAGE;
            }
            else {
                // 如果是全选或当页全选，则取消所有选择；否则选中当前页
                e.target.value = (info.i === -1 || info.i === table.props.datasource.length)
                    ? SELECT_COMMAND.CLEAR : SELECT_COMMAND.CURRENT_PAGE;
            }
            this.props.tableComponent.onRowSelect(e);
        },
        render: function () {
            var table = this.props.tableComponent;
            var info = getInformationFromTable(table);
            var disabled = table.props.disabled;
            var checked = info.i === -1
                || (info.workMode === SELECT_MODE.CURRENT_PAGE && info.i === table.props.datasource.length);
            table.props.datasource.length === 0 && (checked = false);
            var indeterminate = info.workMode === SELECT_MODE.CURRENT_PAGE
                ? (info.i > 0 && info.i < table.props.datasource.length)
                : (info.i !== -1 && info.i > 0);
            var virtualCheckboxProps = {
                onClick: this.onMainSelectorChange,
                
                className: 'fcui2-icon fcui2-icon-checkbox'
                    + (!checked && indeterminate ? '-indeterminate' : (checked ? '-selected' : '-unselected'))
                    + (disabled ? '-disabled' : '')
            };
            var virtualCheckboxStyle = {
                position: 'absolute',
                top: 0,
                left: 7
            };
            if (info.workMode === SELECT_MODE.CURRENT_PAGE || info.workMode === SELECT_MODE.ALL) {  
                return (
                    <th className="th-header table-selector" ref="container">
                        <span {...virtualCheckboxProps}/>
                    </th>
                );
            }
            var skin = this.context.appSkin ? this.context.appSkin + '-' : '';
            var containerProp = {
                className: 'fcui2-dropdownlist fcui2-dropdownlist-' + skin +'normal'
                    + (disabled ? ' fcui2-dropdownlist-' + skin +'disabled' : '')
                    + (this.state.layerOpen && !disabled ? ' fcui2-dropdownlist-' + skin +'normal-hover' : ''),
                onMouseEnter: cTools.openLayerHandlerFactory(this, 'layerOpen'),
                onMouseLeave: cTools.closeLayerHandlerFactory(this, 'layerOpen'),
                style: {
                    width: 30
                },
                ref: 'container'
            };
            var layerProp = {
                 isOpen: this.state.layerOpen && !disabled,
                 anchor: this.refs.container,
                 location: 'bottom top right',
                 onMouseLeave: cTools.closeLayerHandlerFactory(this, 'layerOpen'),
                 ref: 'layer',
                 skin: this.context.appSkin ? (this.context.appSkin + '-normal') : 'normal'
            };
            return (
                <th className="th-header table-selector" rowSpan={this.props.rowSpan}>
                    <div {...containerProp}>
                        <div className="icon-right fcui2-icon fcui2-icon-arrow-down"></div>
                        &nbsp;
                        <span {...virtualCheckboxProps} style={virtualCheckboxStyle}/>
                        <Layer {...layerProp}>
                            <List datasource={this.props.datasource} onClick={this.onListClick}/>
                        </Layer>
                    </div>
                </th>
            );
        }
    });
});
