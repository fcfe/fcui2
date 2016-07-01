/**
 * 时间选择器
 * @author Brian Li, Han Bing Feng
 * @email lbxxlht@163.com
 * @version 0.0.2.1
 */
define(function (require) {


    var React = require('react');
    var InputWidget = require('./mixins/InputWidget');
    var DragableWidget = require('./mixins/DragableWidget');
    var CheckBox = require('./CheckBox.jsx');
    var NormalValueRenderer = require('./components/schedule/NormalValueRenderer.jsx');
    var NormalLegendRenderer = require('./components/schedule/NormalLegendRenderer.jsx');
    var Layer = require('./Layer.jsx');


    var util = require('./core/util');
    var tools = require('./core/scheduleTools');
    var cTools = require('./core/componentTools');
    var language = require('./core/language').schedule;


    return React.createClass({
        // @override
        mixins: [InputWidget, DragableWidget],
        // @override
        /**
         * @properties
         * @param {Import|Properties} src\core\componentTools.js skin className style disabled
         * @param {ReactClass} valueRenderer 值渲染器
         * @param {Function} valuePrepare 值渲染器渲染前的属性指针回调
         * @param {ReactClass} legendRenderer 悬浮简介框渲染器
         * @param {Object} flags 开关对象
         * @param {Boolean} enableRowSelector 是否开启行选择器
         * @param {Boolean} enableColumnSelector 是否开启列选择器
         * @param {Function} onScheduleSelected 鼠标选中某片区域后的回调
         * @param {Import|Properties} src\mixins\InputWidget.js
         *      value onChange name validations customErrorTemplates valueTemplate
         */
        /**
         * @fire Import src\mixins\InputWidget.js XXX onChange
         */
        getDefaultProps: function () {
            return {
                // base
                skin: '',
                className: '',
                style: {},
                disabled: false,
                // self
                valueRenderer: NormalValueRenderer,
                valuePrepare: cTools.noop,
                legendRenderer: NormalLegendRenderer,
                flags: {
                    enableRowSelector: false,
                    enableColumnSelector: false
                },
                onScheduleSelected: cTools.noop,
                // mixin
                valueTemplate: '[]'
            };
        },
        // @override
        getInitialState: function () {
            return {
                isPreventMouseEvent: false,
                mouseDownX: -1,
                mouseDownY: -1,
                mouseCurrentX: -1,
                mouseCurrentY: -1
            };
        },
        onOptMouseMove: function (e) {
            if (this.props.disabled || this.state.isPreventMouseEvent) {
                return;
            }
            var pos = util.getDOMPosition(this.refs.optArea);
            this.setState({
                mouseCurrentX: e.clientX - pos.x,
                mouseCurrentY: e.clientY - pos.y
            });
        },
        onOptMouseOut: function (e) {
            if (this.props.disabled || this.state.isPreventMouseEvent) {
                return;
            }
            this.setState({
                mouseDownX: -1,
                mouseDownY: -1,
                mouseCurrentX: -1,
                mouseCurrentY: -1,
                isPreventMouseEvent: false
            });
        },
        onDragStart: function (e) {
            if (this.props.disabled) return;
            var pos = util.getDOMPosition(this.refs.optArea);
            this.setState({
                isPreventMouseEvent: true,
                mouseDownX: e.clientX - pos.x,
                mouseDownY: e.clientY - pos.y
            });
            this.___dragStart___(e);
        },
        onDrag: function (dx, dy) {
            this.setState({
                mouseCurrentX: this.state.mouseCurrentX + dx,
                mouseCurrentY: this.state.mouseCurrentY + dy
            });
        },
        /**
         * @fire schedule onScheduleSelected
         * @param {Event} e 原生DOM事件对象
         * @param {Object} param 参数对象
         * @param {HtmlElement} param.cursorDOM schedule的虚拟可变形光标 
         * @param {ReactComponent} param.targetComponent 触发事件的组件实例
         * @param {ScheduleRange} param.selectedRange 选中区域对象
         */
        /**
         * @structure Import src\core\scheduleTools.js ScheduleRange
         */
        onDrop: function (dx, dy, e) {
            if (this.props.disabled) return;
            e.returnValue = true;
            typeof this.props.onScheduleSelected === 'function' && this.props.onScheduleSelected(e, {
                cursorDOM: this.refs.cursor,
                targetComponent: this,
                selectedRange: tools.getSelectedRange(this.state)
            });
            if (!e.returnValue) return; 
            e = {target: this.refs.container};
            e.target.value = tools.updateValueByMouse(this.___getValue___(), this.state);
            this.setState({
                mouseDownX: -1,
                mouseDownY: -1,
                mouseCurrentX: -1,
                mouseCurrentY: -1,
                isPreventMouseEvent: false
            });
            this.___dispatchChange___(e);
        },
        onSelectRow: function (e) {
            var i = e.target.value * 1;
            var v = e.target.checked;
            this.updateValue({x: 0, y: i}, {x: 24, y: i}, v ? '' : null);
        },
        onSelectColumn: function (e) {
            var i = e.target.value * 1;
            var v = e.target.checked;
            this.updateValue({x: i, y: 0}, {x: i, y: 6}, v ? '' : null);
        },
        updateValue: function (axis1, axis2, v) {
            if (this.props.disabled) return;
            this.refs.container.value = tools.updateValueByAxis(this.___getValue___(), axis1, axis2, v);
            this.___dispatchChange___({target: this.refs.container});
        },
        render() {
            var containerProp = cTools.containerBaseProps('schedule', this);
            var dragLayerProp = {
                onMouseMove: this.onOptMouseMove,
                onMouseDown: this.onDragStart,
                onMouseOut: this.onOptMouseOut
            };
            var cursorProp = {
                ref: 'cursor',
                className: 'cursor-layer' + (this.state.mouseDownX > -1 ? ' cursor-layer-active' : ''),
                style: tools.getCursorSize(this.state) 
            };
            var layerProp = {
                ref: 'legendLayer',
                isOpen: this.state.mouseCurrentX > -1 && !this.state.isPreventMouseEvent,
                anchor: this.refs.cursor,
                location: 'right left bottom top',
                onOffset: function (e) {
                    e.top += e.clockPosition + '' === '6' || e.clockPosition + '' === '7' ? 10 : -10; 
                }
            };
            var legendProp = {
                axis: tools.getGridAxis(this.state.mouseCurrentX, this.state.mouseCurrentY),
                value: this.___getValue___(),
                parentComponent: this
            };
            var valueRenderProp = {
                value: this.___getValue___(),
                prepare: this.props.valuePrepare,
                parentComponent: this
            };
            var ValueRenderer = typeof this.props.valueRenderer === 'function'
                ? this.props.valueRenderer : NormalValueRenderer;
            var LegendRenderer = typeof this.props.legendRenderer === 'function'
                ? this.props.legendRenderer : NormalLegendRenderer;
            return (
                <div {...containerProp}>
                    {columnSelectorFactory(this)}
                    <div className="opt-area" ref="optArea">
                        <div className="grid-layer">{gridFactory()}</div>
                        <ValueRenderer {...valueRenderProp}/>
                        <div {...cursorProp}></div>
                        <div className="drag-layer" {...dragLayerProp}></div>
                    </div>
                    <div className="axis-y-area">{axisYFactory(this)}</div>
                    <div className="axis-x-area">{axisXFactory()}</div>
                    <Layer {...layerProp}>
                        <LegendRenderer {...legendProp}/>
                    </Layer>
                </div>
            );
        }
    });


    function gridFactory() {
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

    function axisXFactory() {
        var doms = [];
        for (var i = 0; i <= 24; i++) {
            doms.push(<div key={i}>{i}</div>);
        }
        return doms;
    }

    function axisYFactory(me) {
        var doms = [];
        var flag = me.props.flags && me.props.flags.hasOwnProperty('enableRowSelector')
            ? me.props.flags.enableRowSelector : true;
        var value = me.___getValue___();
        if (flag) {
            for (var i = 0; i < 7; i++) {
                var selected = tools.getRangeSelectedCount(value, {x: 0, y: i}, {x: 24, y: i});
                var prop = {
                    disabled: me.props.disabled,
                    label: language.day[i],
                    labelPosition: 'right',
                    key: i,
                    value: i,
                    indeterminate: selected > 0,
                    checked: selected === 24,
                    style: {top: i * 24},
                    onChange: me.onSelectRow
                };
                doms.push(<CheckBox {...prop}/>);
            }
            return doms;
        }
        for (var i = 0; i < 7; i++) {
            doms.push(
                <div key={i} className="fcui2-checkbox disabled-selected" style={{top: i * 24}}>
                    {language.day[i]}
                </div>
            );
        }
        return doms;
    }

    function columnSelectorFactory(me) {
        var flag = me.props.flags && me.props.flags.hasOwnProperty('enableColumnSelector')
            ? me.props.flags.enableColumnSelector : true;
        if (!flag) return null;
        var doms = [];
        var value = me.___getValue___();
        for (var i = 0; i < 24; i++) {
            var selected = tools.getRangeSelectedCount(value, {x: i, y: 0}, {x: i, y: 6});
            var prop = {
                disabled: me.props.disabled,
                label: '',
                key: i,
                value: i,
                indeterminate: selected > 0,
                checked: selected === 7,
                onChange: me.onSelectColumn
            };
            doms.push(<CheckBox {...prop}/>);
        }
        return (<div className="column-selector-area">{doms}</div>);
    }

});
