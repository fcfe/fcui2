/**
 * @file 时间选择组件
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.1
 */
define(function (require) {


    var React = require('react');
    var InputWidgetBase = require('./mixins/InputWidgetBase');
    var InputWidgetInForm = require('./mixins/InputWidgetInForm');


    var util = require('./core/util');
    var tools = require('./core/scheduleTools');
    var language = require('./core/language').schedule;


    var CheckBox = require('./CheckBox.jsx');


    return React.createClass({
        // @override
        mixins: [InputWidgetBase, InputWidgetInForm],
        // @override
        getDefaultProps: function () {
            return {
                className: '',
                disabled: false,
                /**
                 * 快捷按钮配置
                 * 上方的快捷按钮配置，按钮的一切都由外部导入，包括处理函数，元素格式如下：
                 * {label: '全部', getValues: function (currentValue) {return '';}}
                 */
                shortCut: [],
                valueTemplate: ''
            };
        },
        // @override
        getInitialState: function () {
            return {
                mouseDownX: -1,
                mouseDownY: -1,
                mouseCurrentX: -1,
                mouseCurrentY: -1
            };
        },
        optDownHandler: function (e) {
            if (this.props.disabled) return;
            var pos = util.getDOMPosition(this.refs.optArea);
            this.setState({
                mouseDownX: e.clientX - pos.x,
                mouseDownY: e.clientY - pos.y
            });
        },
        optMoveHandler: function (e) {
            if (this.props.disabled) return;
            var pos = util.getDOMPosition(this.refs.optArea);
            this.setState({
                mouseCurrentX: e.clientX - pos.x,
                mouseCurrentY: e.clientY - pos.y
            });
        },
        optUpHandler: function (e) {
            if (this.props.disabled) return;
            e.target = this.refs.container;
            e.target.value = tools.updateValueByMouse(this.___getValue___(), this.state);
            this.___dispatchChange___(e);
            this.setState({mouseDownX: -1, mouseDownY: -1});
        },
        optLeaveHandler: function (e) {
            if (this.props.disabled) return;
            this.setState({
                mouseDownX: -1,
                mouseDownY: -1,
                mouseCurrentX: -1,
                mouseCurrentY: -1
            });
        },
        columnSelectorHandler: function (e) {
            if (this.props.disabled) return;
            var i = util.getDataset(e.target).uiCmd * 1;
            var value = this.___getValue___();
            var selected = tools.selectedCount(value, {x: i, y: 0}, {x: i, y: 6});
            e.target = this.refs.container;
            e.target.value = tools.updateValueByAxis(value, {x: i, y: 0}, {x: i, y: 6}, selected === 7 ? 0 : 1);
            this.___dispatchChange___(e);
        },
        rowSelectorHandler: function (e) {
            if (this.props.disabled) return;
            var i = e.target.value * 1;
            var v = e.target.checked;
            var value = this.___getValue___();
            e.target = this.refs.container;
            e.target.value = tools.updateValueByAxis(value, {x: 0, y: i}, {x: 24, y: i}, v ? 1 : 0);
            this.___dispatchChange___(e);
        },
        shortCutClickHandler: function (e) {
            if (this.props.disabled) return;
            var i = util.getDataset(e.target).uiCmd * 1;
            e.target = this.refs.container;
            e.target.value = this.props.shortCut[i].getValues(this.___getValue___());
            this.___dispatchChange___(e);
        },
        render: function () {
            var value = this.___getValue___();
            var cAxis = tools.gridAxis(this.state.mouseCurrentX, this.state.mouseCurrentY);
            var dragLayerProp = {
                onMouseDown: this.optDownHandler,
                onMouseUp: this.optUpHandler,
                onMouseMove: this.optMoveHandler,
                onMouseLeave: this.optLeaveHandler
            };
            var titleProp = {
                style: tools.titleLayerSize(cAxis, this.state.mouseDownX > -1 || this.state.mouseCurrentX < 0)
            };
            /**
             * 操作区由5层组成，从下到上依次是：
             * 1.网格层，不透明
             * 2.选中时间展示层，半透明，绿色
             * 3.虚拟光标层，半透明，黄色，蓝边框
             * 4.鼠标信息显示层，不透明，白色
             * 5.鼠标事件响应层，透明
             */
            return (
                <div className={'fcui2-schedule ' + this.props.className} ref="container">
                    <div className="fast-operation-bar">
                        {shortCutFactory(this)}
                    </div>
                    <div className="column-area">{columnSelectorFactory(this, value)}</div>
                    <div className="opt-area" ref="optArea">
                        <div className="grid-layer">{gridFactory(this)}</div>
                        <div className="label-layer">{labelFactory(value)}</div>
                        <div className="cursor-layer" style={tools.cursorSize(this.state)}></div>
                        <div className="title-layer" {...titleProp}>
                            <div>{cAxis.x + ':00 - ' + cAxis.x + ':59'}</div>
                            <div>{language.dragAble}</div>
                        </div>
                        <div className="drag-layer" {...dragLayerProp}></div>
                    </div>
                    <div className="row-area">{rowSelectorFactory(this, value)}</div>
                    <div className="axis-area">{axisFactory()}</div>
                </div>
            );
        }
    });


    function axisFactory() {
        var doms = [];
        for (var i = 0; i < 24; i += 2) {
            doms.push(<div key={i}>{i + ':00'}</div>);
        }
        return doms;
    }


    function gridFactory(me) {
        var grid = [];
        for (var i = 0; i < 7; i++) {
            for (var j = 0; j < 24; j++) {
                var props = {
                    key: j + '-' + i,
                    style: {left: j * 24, top: i * 24}
                };
                grid.push(<div {...props}></div>);
            }    
        }
        return grid;
    }


    function labelFactory(value) {
        value = tools.parseValue(value);
        var doms = [];
        for (var i = 0; i < value.length; i++) {
            var labels = tools.value2label(value[i]);
            for (var j = 0; j < labels.length; j++) {
                var label = labels[j];
                var text = label.end - label.begin > 1 ? (label.begin + ':00-' + label.end + ':59') : '';
                var prop = {
                    key: 'label-' + i + '-' + j,
                    style: {
                        top: i * 24 + 1,
                        left: label.begin * 24 + 1,
                        height: 24,
                        width: (label.end - label.begin + 1) * 24
                    }
                }
                doms.push(<div {...prop}>{text}</div>);
            }
        }
        return doms.length > 0 ? doms : '';
    }


    function columnSelectorFactory(me, value) {
        var doms = [];
        for (var i = 0; i < 24; i++) {
            var prop = {
                className: 'font-icon font-icon-largeable-arrow-down',
                'data-ui-cmd': i,
                key: i,
                onClick: me.columnSelectorHandler
            };
            var selected = tools.selectedCount(value, {x: i, y: 0}, {x: i, y: 6});
            if (selected > 0) prop.style = {color: '#3E3E3E'};
            if (selected === 7) prop.style = {color: '#2F82F5'};
            doms.push(<div {...prop}></div>);
        }
        return doms;
    }


    function rowSelectorFactory(me, value) {
        var doms = [];
        for (var i = 0; i < 7; i++) {
            var selected = tools.selectedCount(value, {x: 0, y: i}, {x: 24, y: i});
            var prop = {
                label: language.day[i],
                labelPosition: 'right',
                key: i,
                value: i,
                indeterminate: selected > 0,
                checked: selected === 24,
                style: {top: i * 24},
                onChange: me.rowSelectorHandler
            };
            doms.push(<CheckBox {...prop} />);
        }
        return doms;
    }


    function shortCutFactory(me) {
        var shortCut = me.props.shortCut;
        if (! shortCut instanceof Array || shortCut.length === 0) return '';
        var doms = [];
        for (var i = 0; i < shortCut.length; i++) {
            var props = {
                key: 'shortcut-' + i,
                'data-ui-cmd': i,
                onClick: me.shortCutClickHandler
            };
            doms.push(<div {...props}>{shortCut[i].label}</div>);
        }
        return doms;
    }


});
