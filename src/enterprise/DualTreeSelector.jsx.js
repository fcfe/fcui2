/**
 * 企业级双树选择器
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2.1
 */
define(function (require) {


    var React = require('react');
    var Renderer = require('../components/tree/SelectRenderer.jsx');
    var DualTreeSelector = require('../DualTreeSelector.jsx');
    var Button = require('../Button.jsx');
    var Layer = require('../Layer.jsx');
    var InputWidget = require('../mixins/InputWidget');


    var cTools = require('../core/componentTools');
    var treeTools = require('../core/treeTools');
    var tableTools = require('../core/tableTools');
    var language = require('../core/language').dualTreeSelectorEnterprise;


    return React.createClass({
        /**
         * @properties
         * @param {Import|Properties} src\core\componentTools.js skin className style disabled
         * @param {Import|Properties} src\core\DualTreeSelector.jsx.js datasource onAction leafRenderer selectorEngine
         * @param {Boolean} isDropDown 是否工作在下拉模式下
         * @param {Boolean} clearTemporaryAfterLayerClose 如果工作在DropDown模式下，layer关闭后是否清理临时操作值
         * @param {Object} labels 话术配置
         * @param {String} labels.dropdownLabel 以DropDown模式工作时外层按钮的话术
         * @param {String} labels.title 选择器上方标题
         * @param {String} labels.leftTreeTitle 左树标题
         * @param {String} labels.rightTreeTitle 右树标题
         * @param {String} labels.footLeftInformation 选择器下方左侧提示话术 
         * @param {String} labels.footSelectCountTpl 选择器右侧中部已选择项模板，其中：
         * '&selected'将被替换成已选择的叶子个数
         * '&total'将被替换成数据源中所有叶子个数
         * @param {String} labels.deleteAll 右侧删除按钮话术
         * @param {Import|Properties} src\mixins\InputWidget.js value onChange name validations customErrorTemplates valueLink valueTemplate
         */
        /**
         * @fire Import src\mixins\InputWidget.js XXX onChange
         */
        /**
         * @structure Import src\Tree.jsx.js TreeItemObject
         */
        /**
         * @structure Import src\DualTreeSelector.jsx.js DualTreeSelectorValueTemplate
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
                // @trans
                datasource: [],
                onAction: cTools.noop,
                leafRenderer: Renderer,
                selectorEngine: treeTools.dualTreeSelectorEngine,
                // self
                clearTemporaryAfterLayerClose: true,
                isDropDown: false,
                labels: {
                    dropdownLabel: 'DualTreeSelector',
                    title: language.selectItems,
                    leftTreeTitle: language.allItems,
                    rightTreeTitle: language.selectedItems,
                    footLeftInformation: '注意：只有叶子节点才能被选中',
                    footSelectCountTpl: language.selectedItemsNumber,
                    deleteAll: language.deleteAll
                },
                // mixin
                valueTemplate: JSON.stringify({selected: {}})
            };
        },
        // @override
        getInitialState: function () {
            return {
                layerOpen: false,
                expand: {},
                dropdownValue: this.___getValue___()
            };
        },
        // @override
        componentWillReceiveProps: function (nextProps) {
            if (nextProps.isDropDown) {
                var value = nextProps.value || this.state.dropdownValue;
                var selected = JSON.parse(value).selected || {};
                var selectorEngine = nextProps.selectorEngine;
                var datasource = nextProps.datasource;
                // 检查selected中标记为1的item的children是否加载完毕了。
                if (treeTools.targetAsyncLeaf(selected, selectorEngine, datasource)) {
                    this.setState({
                        dropdownValue: JSON.stringify({selected: selected})
                    });
                }
            }
        },
        onDropDownTreeChange: function (e) {
            this.setState({dropdownValue: e.target.value});
        },
        onTreeChange: function (e) {
            this.___dispatchChange___(e);
        },
        onTreeAction: function (type, args) {
            if (type === 'TreeExpandNode') {
                this.setState({expand: args.expand});
            }
            typeof this.props.onAction === 'function' && this.props.onAction(type, args);
        },
        onLayerEnter: function (e) {
            e.target.value = this.state.dropdownValue;
            this.___dispatchChange___(e);
            this.setState({
                layerOpen: false
            });
        },
        onLayerRender: function () {
            this.refs.dualTreeSelector.setState({
                expand: this.state.expand
            });
        },
        onLayerClose: function () {
            this.setState({
                layerOpen: false,
                dropdownValue: this.props.value && this.props.clearTemporaryAfterLayerClose
                    ? this.props.value : this.state.dropdownValue
            });
        },
        deleteAll: function (e) {
            var value = this.props.isDropDown ? this.state.dropdownValue : this.___getValue___();
            value = JSON.parse(value);
            value.selected = {};
            e.target.value = JSON.stringify(value);
            if (this.props.isDropDown) {
                this.setState({
                    dropdownValue: e.target.value
                });
            }
            else {
                this.___dispatchChange___(e);
            }
        },
        render: function () {
            if (!this.props.isDropDown) return mainContentFactory(this);
            var containerProp = cTools.containerBaseProps('dropdownlist', this, {
                merge: {
                    onClick: cTools.openLayerHandlerFactory(this, 'layerOpen')
                }
            });
            var label = this.props.labels && this.props.labels.dropdownLabel
                    ? this.props.labels.dropdownLabel : '';
            var layerProp = {
                isOpen: this.state.layerOpen,
                anchor: this.refs.dropdownContainer,
                location: 'bottom right left',
                closeWithBodyClick: true,
                onCloseByWindow: this.onLayerClose,
                onRender: this.onLayerRender
            };
            containerProp.ref = 'dropdownContainer';
            return (
                <div {...containerProp}>
                    <div className="icon-right font-icon font-icon-largeable-caret-down"></div>
                    <span>{label}</span>
                    <Layer {...layerProp}>
                        <div style={{padding: 10}}>
                            {mainContentFactory(this)}
                            <Button label={language.enter} skin="important" onClick={this.onLayerEnter}/>
                            <Button label={language.cancel} onClick={this.onLayerClose} style={{marginLeft: 10}}/>
                        </div>
                    </Layer>
                </div>
            );
        }
    });


    function mainContentFactory(me) {
        var value = me.props.isDropDown ? me.state.dropdownValue : me.___getValue___();
        var treeProp = {
            ref: 'dualTreeSelector',
            value: value,
            datasource: me.props.datasource,
            leafRenderer: me.props.leafRenderer,
            selectorEngine: me.props.selectorEngine,
            onChange: me.props.isDropDown ? me.onDropDownTreeChange : me.onTreeChange,
            onAction: me.onTreeAction
        };
        var labels = me.props.labels || {};
        var count = treeTools.getLeafCount(me.props.datasource);
        var selected = 0;
        try {
            selected = tableTools.getSelectedCount(JSON.parse(value).selected);
        }
        catch (e) {
            // DO NOTHING
        }
        var selectedInfo = labels.footSelectCountTpl
            ? labels.footSelectCountTpl.replace(/&selected/g, selected).replace(/&total/g, count) : null;
        var containerProp = me.props.isDropDown ? {
                className: 'fcui2-dualtreeselector-enterprise fcui2-dualtreeselector-enterprise-'
                    + (me.props.skin ? me.props.skin : 'normal')
            } : cTools.containerBaseProps('dualtreeselector-enterprise', me);
        return (
            <div {...containerProp}>
                {labels.title ? <div className="selector-title-bar">{labels.title}</div> : null} 
                <div className="tree-title-bar">
                    <div>{labels.leftTreeTitle ? labels.leftTreeTitle : null}</div>
                    <div>{labels.rightTreeTitle ? labels.rightTreeTitle : null}</div>
                </div>
                <DualTreeSelector {...treeProp}/>
                <div className="tree-foot-bar">
                    <div>{labels.footLeftInformation ? labels.footLeftInformation : null}</div>
                    <div>
                        <span className="remove-all-button" onClick={me.deleteAll}>
                            {labels.deleteAll ? labels.deleteAll : null}
                        </span>
                        {selectedInfo}
                    </div>
                </div>
            </div>
        );
    }


});
