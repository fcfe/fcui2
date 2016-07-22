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
    var _ = require('underscore');

    var cTools = require('../core/componentTools');
    var treeTools = require('../core/treeTools');
    var tableTools = require('../core/tableTools');
    var language = require('../core/language').dualTreeSelectorEnterprise;
    var util = require('../core/util');

    var defaultLabels = {
        dropdownLabel: 'DualTreeSelector',
        title: language.selectItems,
        leftTreeTitle: language.allItems,
        rightTreeTitle: language.selectedItems,
        footLeftInformation: '注意：只有叶子节点才能被选中',
        footSelectCountTpl: language.selectedItemsNumber,
        deleteAll: language.deleteAll,
        appendAll: language.appendAll,
        errorMessage: ''
    };

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
         * @param {String} labels.appendAll 左侧添加按钮话术
         * @param {String} labels.errorMessage 错误信息话术
         * @param {Function} onBeforeClose layer关闭前的回调，只在isDropDown=true时有效
         * @param {Function} onLayerClose layer关闭后回调，只在isDropDown=true时有效
         * @param {Import|Properties} src\mixins\InputWidget.js value onChange name validations customErrorTemplates valueTemplate
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
                labels: defaultLabels,
                onBeforeLayerClose: cTools.noop,
                onLayerClose: cTools.noop,
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
            if (
                nextProps.isDropDown
                && !_.isEqual(
                    JSON.parse(nextProps.value || '{}'),
                    JSON.parse(this.state && this.state.dropdownValue ? this.state.dropdownValue : '{}')
                )
                && this.state 
                && !this.state.___beOperated___
            ) {
                this.setState({dropdownValue: nextProps.value});
            }
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
        onDropDownTreeChange: function (e) {
            this.setState({
                dropdownValue: e.target.value,
                ___beOperated___: true
            });
        },
        onLayerRender: function () {
            this.refs.dualTreeSelector.setState({
                expand: this.state.expand
            });
        },
        onLayerEnter: function (e) {
            e.target.value = this.state.dropdownValue;
            this.___dispatchChange___(e);
            var tmpValue = this.state.dropdownValue;
            if (this.props.clearTemporaryAfterLayerClose) {
                tmpValue = this.props.value ? this.props.value : '';
            }
            this.setState({___beOperated___: false});
            e = {};
            this.onBeforeLayerClose(e);
            if (e.returnValue) {
                typeof this.props.onLayerClose === 'function' && this.props.onLayerClose();
                this.setState({
                    layerOpen: false,
                    dropdownValue: tmpValue
                });
            }
        },
        onLayerClose: function (e) {
            var tmpValue = this.state.dropdownValue;
            var beOperated = this.state.___beOperated___;
            if (this.props.clearTemporaryAfterLayerClose) {
                tmpValue = this.props.value ? this.props.value : '';
                beOperated = false;
            }
            typeof this.props.onLayerClose === 'function' && this.props.onLayerClose();
            this.setState({
                layerOpen: false,
                dropdownValue: tmpValue,
                ___beOperated___: beOperated
            });
        },
        onBeforeLayerClose: function (e) {
            e.returnValue = true;
            typeof this.props.onBeforeLayerClose === 'function' && this.props.onBeforeLayerClose(e);
        },
        appendAll: function (e) {
            // 只添加叶子，children为空数组不是叶子，不可用的叶子不添加
            var value = {};
            appendLeaf(this.props.datasource);
            e.target.value = JSON.stringify({selected: value});
            if (this.props.isDropDown) {
                this.setState({
                    ___beOperated___: true,
                    dropdownValue: e.target.value
                });
            }
            else {
                this.___dispatchChange___(e);
            }
            function appendLeaf(arr) {
                for (var i = 0; i < arr.length; i++) {
                    var item = arr[i];
                    if (item.disabled) continue;
                    if (!item.hasOwnProperty('children')) {
                        value[item.value] = true;
                        continue;
                    }
                    if (item.children instanceof Array && item.children.length) {
                        appendLeaf(item.children);
                    }
                }
            }
        },
        deleteAll: function (e) {
            var value = this.props.isDropDown ? this.state.dropdownValue : this.___getValue___();
            value = JSON.parse(value || '{}');
            value.selected = {};
            e.target.value = JSON.stringify(value);
            if (this.props.isDropDown) {
                this.setState({
                    ___beOperated___: true,
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
                },
                widthCorrect: -12
            });
            var labels = _.extend({}, defaultLabels, this.props.labels);
            var layerProp = {
                ref: 'layer',
                isOpen: this.state.layerOpen,
                anchor: this.refs.dropdownContainer,
                style: {
                    width: '545px',
                    height: '485px'
                },
                location: 'bottom right left',
                closeWithBodyClick: true,
                onCloseByWindow: this.onLayerClose,
                onRender: this.onLayerRender
            };
            var enterButtonProp = {
                disabled: !this.state.___beOperated___,
                label: language.enter,
                skin: 'important',
                onClick: this.onLayerEnter
            };
            containerProp.ref = 'dropdownContainer';
            containerProp.className += layerProp.isOpen ? ' fcui2-dropdownlist-hover' : '';
            return (
                <div {...containerProp}>
                    <div className="icon-right font-icon font-icon-largeable-caret-down"></div>
                    <span className="label-container">{labels.dropdownLabel ? labels.dropdownLabel : ''}</span>
                    <Layer {...layerProp}>
                        <div style={{padding: 10}}>
                            {mainContentFactory(this)}
                            <Button {...enterButtonProp}/>
                            <Button label={language.cancel} onClick={this.onLayerClose} style={{marginLeft: 10}}/>
                            <span className="fcui2-error-msg">
                                {labels.errorMessage && !this.state.___beOperated___ ? labels.errorMessage : ''}
                            </span>
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
        var labels = _.extend({}, defaultLabels, me.props.labels);
        var count = treeTools.getLeafCount(me.props.datasource);
        var selected = 0;
        try {
            selected = tableTools.getSelectedCount(JSON.parse(value || '{}').selected);
        }
        catch (e) {
            // DO NOTHING
        }
        var selectedInfo = labels.footSelectCountTpl
            ? labels.footSelectCountTpl.replace(/&selected/g, selected).replace(/&total/g, count) : null;
        var containerProp = me.props.isDropDown ? {
                ref: 'container',
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
                    <div>
                        <span className="remove-all-button" onClick={me.appendAll}>
                            {labels.appendAll ? labels.appendAll : null}
                        </span>
                        {labels.footLeftInformation ? labels.footLeftInformation : null}
                    </div>
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
