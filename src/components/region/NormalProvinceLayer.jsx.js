/**
 * @file 省选择零件
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.1
 */
define(function (require) {


    var React = require('react');
    var MouseWidgetBase = require('../../mixins/MouseWidgetBase');
    var CheckBox = require('../../CheckBox.jsx');
    var Radio = require('../../Radio.jsx');
    var language = require('../../core/language').region;


    return React.createClass({   
        // @override
        mixins: [MouseWidgetBase],
        // @override
        getDefaultProps: function () {
            return {
                datasource: [],
                value: {},
                onChange: function () {},
                onHide: function () {},
                type: 'multi'
            };
        },
        // @override
        componentWillUnmount: function () {
            this.props.onHide();
        },
        // @override
        getInitialState: function () {
            return {};
        },
        mouseEnterHandler: function () {
            this.___mouseenterHandler___();
            this.props.parent.setState({hover: true});
        },
        mouseLeaveHandler: function () {
            this.___mouseleaveHandler___();
            this.props.parent.setState({hover: false});
        },
        changeHandler: function (e) {
            this.props.onChange(e);
        },
        render: function () {
            var containerProp = {
                className: 'fcui2-region-city-container',
                onMouseLeave: this.mouseLeaveHandler,
                onMouseEnter: this.mouseEnterHandler,
            };
            return (
                <div {...containerProp}><table><tbody>
                    {cityFactory(this.props.datasource, this.props.value, this)} 
                </tbody></table></div>
            );
        }
    });


    function cityFactory(arr, value, me) {
        if (!arr || arr.length === 0) return '';
        var doms = [];
        var maxLines = 6;
        var step = Math.max(parseInt(arr.length / maxLines), 3);
        for (var i = 0; i < arr.length; i+= step) {
            doms.push(<tr key={i}>{lineF(i)}</tr>);
        }
        return doms;
        function lineF(i) {
            var line = [];
            for (var j = 0; j < step; j++) {
                if (i + j === arr.length) break;
                line.push(
                    <td key={i + j}>{
                        me.props.type === 'single'
                            ? <Radio {...propF(arr[i + j])} /> : <CheckBox {...propF(arr[i + j])} />
                    }</td>
                );
            }
            return line;
        }
        function propF(id) {
            return {
                key: id,
                value: id,
                label: language.regionName[id],
                checked: value[id] === true,
                labelPosition: 'right',
                onChange: me.changeHandler
            };
        }
    }

});
