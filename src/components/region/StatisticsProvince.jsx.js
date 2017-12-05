/**
 * Region 带有汇总信息的省渲染器
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2
 */
define(function (require) {


    var React = require('react');
    var CheckBox = require('../../CheckBox.jsx');
    var Radio = require('../../Radio.jsx');
    var Layer = require('../../Layer.jsx');


    var tools = require('../../core/regionTools');
    var language = require('../../core/language').region;


    return React.createClass({
        // @override
        /**
         * @properties
         * @param {Number} id 省所属的编号
         * @param {Object} value Region组件转译后的value，以省市编号为key，有哪个key，代表哪个地区被选中
         * @param {ReactComponent} parent 渲染器所属的Region组件实例
         * @param {Boolean} disabled 渲染器是否处于禁用状态
         * @param {String} type 渲染器的选择状态，'single'表示单选，其他为多选
         * @param {Function} onChange 选择状态改变后的回调
         */
        getDefaultProps: function () {
            return {
                id: -1,
                disabled: false,
                type: 'multi',
                parent: {},
                value: {},
                onChange: function () {}
            };
        },
        // @override
        getInitialState: function () {
            return {
                layerShow: false
            };
        },
        onProvinceChange: function (e) {
            if (this.props.disabled) return;
            this.props.onChange(e);
        },
        onMouseLeave: function (e) {
            var me = this;
            me.mouseenter = false;
            // 延迟关闭
            setTimeout(function () {
                if (me.refs.layer && me.refs.layer.state.mouseenter) return;
                if (me.props.parent.___currentLayer___ === me) {
                    me.props.parent.___currentLayer___ = null;
                }
                me.setState({layerShow: false});
            }, 100);
        },
        onMouseEnter: function (e) {
            this.mouseenter = true;
            if (this.props.disabled || !tools.filiation[this.props.id] || tools.filiation[this.props.id].length < 1) {
                return;
            }
            if (this.props.parent.___currentLayer___ && this.props.parent.___currentLayer___ !== this) {
                this.props.parent.___currentLayer___.setState({layerShow: false});
            }
            this.props.parent.___currentLayer___ = this;
            this.setState({layerShow: true});
        },
        onLayerMouseLeave: function (e) {
            var me = this;
            setTimeout(function () {
                if (me.mouseenter) return;
                if (me.props.parent.___currentLayer___ === me) {
                    me.props.parent.___currentLayer___ = null;
                }
                me.setState({layerShow: false});
            }, 100);
        },
        render: function () {
            var selected = tools.getSelectedState(this.props.id, this.props.value);
            var containerProp = {
                ref: 'container',
                className: 'fcui2-region-province',
                style: this.state.layerShow ? {border: '1px solid #C8C8C8'} : undefined,
                onMouseLeave: this.onMouseLeave,
                onMouseEnter: this.onMouseEnter
            };
            var checkboxProps = checkboxPropsFactory(this.props.id, this.props.value, this);
            var layerProps = {
                isOpen: this.state.layerShow,
                anchor: this.refs.container,
                ref: 'layer',
                onMouseLeave: this.onLayerMouseLeave
            };
            return(
                <div {...containerProp}>
                    {this.props.type === 'single' ? <Radio {...checkboxProps}/> : <CheckBox {...checkboxProps}/>}
                    <span class="statistics-label" style={{display: selected.selected > 0 ? 'inline' : 'none'}}>
                        {selected.selected + '/' + selected.total}
                    </span>
                    <Layer {...layerProps}>
                        <table className="fcui2-region-city-container">
                            <tbody>{cityFactory(this)}</tbody>
                        </table>
                    </Layer>
                </div>
            );
        }
    });


    function cityFactory(me) {
        var datasource = tools.filiation[me.props.id];
        if (!datasource || datasource.length === 0) return '';
        var doms = [];
        var maxLines = 6;
        var step = Math.max(parseInt(datasource.length / maxLines), 3);
        for (var i = 0; i < datasource.length; i+= step) {
            var line = [];
            for (var j = 0; j < step; j++) {
                if (i + j === datasource.length) break;
                var props = checkboxPropsFactory(datasource[i + j], me.props.value, me);
                line.push(
                    <td key={i + j}>
                        {me.props.type === 'single' ? <Radio {...props}/> : <CheckBox {...props}/>}
                    </td>
                );
            }
            doms.push(<tr key={i}>{line}</tr>);
        }
        return doms;
    }


    function checkboxPropsFactory(id, value, me) {
        var selected = tools.getSelectedState(id, value, me.props.parent.props.noLinkage);
        return {
            disabled: me.props.disabled,
            label: language.regionName[id],
            labelPosition: 'right',
            value: id,
            checked: selected.checked,
            indeterminate: selected.indeterminate,
            onChange: me.onProvinceChange
        };
    }



});
