/**
 * @file 时间选择组件
 * @author Brian Li
 * @author Han Bing Feng
 * @email lbxxlht@163.com
 * @version 0.0.2
 */

define(function (require) {
    let React = require('react');
    let _ = require('underscore');

    let InputWidgetBase = require('./mixins/InputWidgetBase');
    let InputWidgetInForm = require('./mixins/InputWidgetInForm');

    let util = require('./core/util');
    let tools = require('./core/scheduleTools');
    let language = require('./core/language').schedule;

    let CheckBox = require('./CheckBox.jsx');

    return React.createClass({
        propTypes: {
            /**
             * 是否使用列选择器。
             */
            enableColumnSelector: React.PropTypes.bool,
            /**
             * 是否使用行选择器。
             */
            enableRowSelector: React.PropTypes.bool,
            /**
             * 选定的时段值。
             * 是一个有7x24元素的数组JSON.stringify后的值。日优先存放一星期每天24小时的时段选择情况。
             * 每个元素可为null，或者一个string。
             * 当为null时，表示该时段没有被选择。
             * 当为string时，表示该时段被选择，string的内容为当前时段的label。
             * 相邻时段相同值的label会被合并。
             * 若label为空串（''），则显示默认label。默认为时段跨度。如1:00-2:00
             */
            value: React.PropTypes.string,
            /**
             * 划出了一个新的时段块时的回调。
             * 回调可通过e.preventDefault()阻止更新发生。此时组件会通过设置
             * isPreventMouseEvent state来阻止后续鼠标事件响应。
             * 使用方做适当处理后，需设置isPreventMouseEvent为false来恢复鼠标响应。
             * @param {SyntheticEvent} onScheduleSelected.e 鼠标mouseup事件
             * @param {number} onScheduleSelected.startHour
             * @param {number} onScheduleSelected.startWeekday
             * @param {number} onScheduleSelected.endHour
             * @param {number} onScheduleSelected.endWeekday
             * @param {HTMLElement} onScheduleSelected.cursorDom 鼠标拖拽所产生的drag layer的dom节点
             */
            onScheduleSelected: React.PropTypes.func,
            /**
             * 绘制悬浮层
             * @return {ReactElement} 悬浮层Element
             */
            titleLayerRenderer: React.PropTypes.func,
            /**
             * 预设的labels列表。
             * @param {string} presetLables[].value 同value定义
             */
            presetLabels: React.PropTypes.arrayOf(React.PropTypes.shape({
                style: React.PropTypes.object,
                value: React.PropTypes.string,
                name: React.PropTypes.string
            }))
        },
        // @override
        mixins: [InputWidgetBase, InputWidgetInForm],
        // @override
        getDefaultProps() {
            return {
                className: '',
                disabled: false,
                /**
                 * 快捷按钮配置
                 * 上方的快捷按钮配置，按钮的一切都由外部导入，包括处理函数，元素格式如下：
                 * {label: '全部', getValues: function (currentValue) {return '';}}
                 */
                shortCut: [],
                valueTemplate: '',
                enableColumnSelector: false,
                enableRowSelector: false,
                onScheduleSelected: _.noop
            };
        },
        // @override
        getInitialState() {
            return {
                mouseDownX: -1,
                mouseDownY: -1,
                mouseCurrentX: -1,
                mouseCurrentY: -1,
                isPreventMouseEvent: false
            };
        },
        optDownHandler(e) {
            if (this.props.disabled) {
                return;
            }
            if (this.state.isPreventMouseEvent) {
                return;
            }
            let pos = util.getDOMPosition(this.refs.optArea);
            this.setState({
                mouseDownX: e.clientX - pos.x,
                mouseDownY: e.clientY - pos.y
            });
        },
        optMoveHandler(e) {
            if (this.props.disabled) {
                return;
            }
            if (this.state.isPreventMouseEvent) {
                return;
            }
            let pos = util.getDOMPosition(this.refs.optArea);
            this.setState({
                mouseCurrentX: e.clientX - pos.x,
                mouseCurrentY: e.clientY - pos.y
            });
        },
        optUpHandler(e) {
            if (this.props.disabled) {
                return;
            }
            if (this.state.isPreventMouseEvent) {
                return;
            }
            let scheduleRange = tools.getScheduleRangeByMouse(this.state);
            e.target = this.refs.container;
            e.target.value = tools.updateValueByMouse(this.___getValue___(), this.state);
            this.props.onScheduleSelected(
                e,
                scheduleRange.startHour,
                scheduleRange.endHour,
                scheduleRange.startWeekday,
                scheduleRange.endWeekday,
                this.refs.cursor
            );
            if (e.isDefaultPrevented()) {
                this.setState({isPreventMouseEvent: true});
                return;
            }
            this.___dispatchChange___(e);
            this.setState({mouseDownX: -1, mouseDownY: -1});
        },
        optLeaveHandler(e) {
            if (this.props.disabled) {
                return;
            }
            if (this.state.isPreventMouseEvent) {
                return;
            }
            this.setState({
                mouseDownX: -1,
                mouseDownY: -1,
                mouseCurrentX: -1,
                mouseCurrentY: -1
            });
        },
        columnSelectorHandler(e) {
            if (this.props.disabled) {
                return;
            }
            let i = util.getDataset(e.target).uiCmd * 1;
            let value = this.___getValue___();
            let selected = tools.selectedCount(value, {x: i, y: 0}, {x: i, y: 6});
            e.target = this.refs.container;
            e.target.value = tools.updateValueByAxis(value, {x: i, y: 0}, {x: i, y: 6}, selected === 7 ? null : '');
            this.___dispatchChange___(e);
        },
        rowSelectorHandler(e) {
            if (this.props.disabled) {
                return;
            }
            let i = e.target.value * 1;
            let v = e.target.checked;
            let value = this.___getValue___();
            e.target = this.refs.container;
            e.target.value = tools.updateValueByAxis(value, {x: 0, y: i}, {x: 24, y: i}, v ? '' : null);
            this.___dispatchChange___(e);
        },
        shortCutClickHandler(e) {
            if (this.props.disabled) {
                return;
            }
            let i = util.getDataset(e.target).uiCmd * 1;
            e.target = this.refs.container;
            e.target.value = this.props.shortCut[i].getValues(this.___getValue___());
            this.___dispatchChange___(e);
        },

        renderTitleLayer: function () {
            if (this.props.titleLayerRenderer) {
                let Renderer = this.props.titleLayerRenderer;
                return <Renderer value={this.getFinalValue()} {...this.props} {...this.state} />;
            }

            let cAxis = tools.gridAxis(this.state.mouseCurrentX, this.state.mouseCurrentY);
            let titleProp = {
                style: tools.titleLayerSize(cAxis, this.state.mouseDownX > -1 || this.state.mouseCurrentX < 0)
            };

            return (
                <div className="title-layer" {...titleProp}>
                    <div>{cAxis.x + ':00 - ' + cAxis.x + ':59'}</div>
                    <div>{language.dragAble}</div>
                </div>
            );
        },

        /**
         * 混合presets label，得到最终的value。
         *
         * @return {string} 混合后的value
         */
        getFinalValue: function () {
            let value = this.___getValue___();
            if (this.props.presetLabels == null) {
                return value;
            }

            let maxLength = 0;
            let labels = _.map(this.props.presetLabels.concat({
                style: null,
                name: null,
                value: value
            }), function (item) {
                let v;
                try {
                    v = JSON.parse(item.value);
                }
                catch (e) {
                    v = [];
                }
                if (v.length > maxLength) {
                    maxLength = v.length;
                }
                return {
                    style: item.style,
                    name: item.name,
                    value: v
                };
            });

            let res = [];
            for (let i = 0; i < maxLength; i++) {
                _.each(labels, function (label) {
                    if (label.value[i] != null) {
                        res[i] = label.style == null ? label.value[i] : label.style;
                    }
                });
            }
            return JSON.stringify(res);
        },
        render() {
            let value = this.getFinalValue();
            let dragLayerProp = {
                onMouseDown: this.optDownHandler,
                onMouseUp: this.optUpHandler,
                onMouseMove: this.optMoveHandler,
                onMouseLeave: this.optLeaveHandler
            };
            /**
             * 操作区由5层组成，从下到上依次是：
             * 1.网格层，不透明
             * 2.选中时间展示层，半透明，蓝色
             * 3.虚拟光标层，半透明，黄色，蓝边框
             * 4.鼠标信息显示层，不透明，白色
             * 5.鼠标事件响应层，透明
             */
            return (
                <div className={'fcui2-schedule ' + this.props.className} ref="container">
                    <div className="fast-operation-bar">
                        {shortCutFactory(this)}
                    </div>
                    {
                        this.props.enableColumnSelector ? (
                            <div className="column-area">{columnSelectorFactory(this, value)}</div>
                        ) : ''
                    }
                    <div className="opt-area" ref="optArea">
                        <div className="grid-layer">{gridFactory(this)}</div>
                        <div className="label-layer">{labelFactory(value)}</div>
                        <div className="cursor-layer" ref="cursor" style={tools.cursorSize(this.state)}></div>
                        {this.renderTitleLayer()}
                        <div className="drag-layer" {...dragLayerProp}></div>
                    </div>
                    <div
                        className={
                            this.props.enableRowSelector ? 'row-area' : 'row-area fcui2-schedule-row-selector-disabled'
                        }
                    >
                        {rowSelectorFactory(this, value)}
                    </div>
                    <div className="axis-area">{axisFactory()}</div>
                </div>
            );
        }
    });

    function axisFactory() {
        let doms = [];
        for (let i = 0; i <= 24; i++) {
            doms.push(<div key={i}>{i}</div>);
        }
        return doms;
    }

    function gridFactory(me) {
        let grid = [];
        for (let i = 0; i < 7; i++) {
            for (let j = 0; j < 24; j++) {
                let props = {
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
        let doms = [];
        for (let i = 0; i < value.length; i++) {
            let labels = tools.value2label(value[i]);
            for (let j = 0; j < labels.length; j++) {
                let label = labels[j];
                let style = {
                    top: i * 24 + 1,
                    left: label.begin * 24 + 1,
                    height: 23,
                    width: (label.end - label.begin + 1) * 24
                };
                let text;
                if (typeof label.value === 'object') {
                    text = '';
                    style = _.extend(style, label.value);
                }
                else {
                    text = label.value === '' ? tools.value2text(label.begin, label.end) : label.value;
                }
                let key = 'label-' + i + '-' + j;
                let prop = {
                    key: key,
                    style: style,
                    ref: key
                };
                doms.push(<div {...prop}>{text}</div>);
            }
        }
        return doms.length > 0 ? doms : '';
    }

    function columnSelectorFactory(me, value) {
        let doms = [];
        for (let i = 0; i < 24; i++) {
            let prop = {
                'className': 'font-icon font-icon-largeable-arrow-down',
                'data-ui-cmd': i,
                'key': i,
                'onClick': me.columnSelectorHandler
            };
            let selected = tools.selectedCount(value, {x: i, y: 0}, {x: i, y: 6});
            if (selected > 0) {
                prop.style = {color: '#3E3E3E'};
            }
            if (selected === 7) {
                prop.style = {color: '#2F82F5'};
            }
            doms.push(<div {...prop}></div>);
        }
        return doms;
    }


    function rowSelectorFactory(me, value) {
        let doms = [];
        if (me.props.enableRowSelector) {
            for (let i = 0; i < 7; i++) {
                let selected = tools.selectedCount(value, {x: 0, y: i}, {x: 24, y: i});
                let prop = {
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

        for (let i = 0; i < 7; i++) {
            doms.push(<div key={i}>{language.day[i]}</div>);
        }
        return doms;
    }


    function shortCutFactory(me) {
        let shortCut = me.props.shortCut;
        if (!(shortCut instanceof Array) || shortCut.length === 0) {
            return '';
        }
        let doms = [];
        for (let i = 0; i < shortCut.length; i++) {
            let props = {
                'key': 'shortcut-' + i,
                'data-ui-cmd': i,
                'onClick': me.shortCutClickHandler
            };
            doms.push(<div {...props}>{shortCut[i].label}</div>);
        }
        return doms;
    }
});
