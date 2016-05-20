/**
 * @file 省选择零件
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
            if (this.props.disabled || !tools.filiation[this.props.id] || tools.filiation[this.props.id].length < 1) {
                return;
            }
            this.setState({layerShow: true});
            if (this.props.parent.___currentLayer___) {
                this.props.parent.___currentLayer___.setState({layerShow: false});
            }
            this.props.parent.___currentLayer___ = this;
        },
        render: function () {
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
                onMouseLeave: this.onMouseLeave
            };
            return(
                <div {...containerProp}>
                    {this.props.type === 'single' ? <Radio {...checkboxProps}/> : <CheckBox {...checkboxProps}/>}
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
