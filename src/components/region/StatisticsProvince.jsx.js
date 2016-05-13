/**
 * @file 省选择零件
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.1
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
                disabled: false,
                id: -1,
                type: 'multi',     
                value: {},
                parent: {},
                onChange: function () {}
            };
        },
        // @override
        getInitialState: function () {
            return {
                layerShow: false
            };
        },
        changeHandler: function (e) {
            if (this.props.disabled) return;
            this.props.onChange(e);
        },
        mouseLeaveHandler: function (e) {
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
        mouseEnterHandler: function (e) {
            if (this.props.disabled || !tools.filiation[this.props.id] || tools.filiation[this.props.id].length < 1) {
                return;
            }
            this.setState({layerShow: true});
            if (this.props.parent.___currentLayer___) {
                this.props.parent.___currentLayer___.setState({layerShow: false});
            }
            this.props.parent.___currentLayer___ = this;
        },
        checkboxPropsFactory: function (id, value) {
            var selected = tools.getSelectedState(id, value);
            return {
                disabled: this.props.disabled,
                label: language.regionName[id],
                labelPosition: 'right',
                value: id,
                checked: selected.checked,
                indeterminate: selected.indeterminate,
                onChange: this.changeHandler
            };
        },
        cityFactory: function () {
            var datasource = tools.filiation[this.props.id];
            if (!datasource || datasource.length === 0) return '';
            var doms = [];
            var maxLines = 6;
            var step = Math.max(parseInt(datasource.length / maxLines), 3);
            for (var i = 0; i < datasource.length; i+= step) {
                var line = [];
                for (var j = 0; j < step; j++) {
                    if (i + j === datasource.length) break;
                    var props = this.checkboxPropsFactory(datasource[i + j], this.props.value);
                    line.push(
                        <td key={i + j}>
                            {this.props.type === 'single' ? <Radio {...props}/> : <CheckBox {...props}/>}
                        </td>
                    );
                }
                doms.push(<tr key={i}>{line}</tr>);
            }
            return doms;
        },
        render: function () {
            var containerProp = {
                ref: 'container',
                className: 'fcui2-region-province',
                style: this.state.layerShow ? {border: '1px solid #C8C8C8'} : undefined,
                onMouseLeave: this.mouseLeaveHandler,
                onMouseEnter: this.mouseEnterHandler
            };
            var selected = tools.getSelectedState(this.props.id, this.props.value);
            var checkboxProps = this.checkboxPropsFactory(this.props.id, this.props.value);
            var layerProps = {
                isOpen: this.state.layerShow,
                anchor: this.refs.container,
                ref: 'layer',
                onMouseLeave: this.mouseLeaveHandler
            };
            return(
                <div {...containerProp}>
                    {this.props.type === 'single' ? <Radio {...checkboxProps}/> : <CheckBox {...checkboxProps}/>}
                    <span style={{display: selected.selected > 0 ? 'inline' : 'none'}}>
                        {selected.selected + '/' + selected.total}
                    </span>
                    <Layer {...layerProps}>
                        <table className="fcui2-region-city-container">
                            <tbody>
                            {this.cityFactory()}
                            </tbody>
                        </table>
                    </Layer>
                </div>
            );
        }
    });

});
