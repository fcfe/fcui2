/**
 * 时间选择器悬浮图例渲染器
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2.1
 */
define(function (require) {


    var React = require('react');
    var tools = require('../../core/scheduleTools');


    return React.createClass({
        /**
         * @properties
         * @param {Object} axis 鼠标所在的格子坐标对象，笛卡尔坐标系
         * @param {Number} axis.x 横坐标，有效区间[0, 23]
         * @param {Number} axis.y 纵坐标，有效区间[0, 6]
         * @param {String} value 等同于schedule.props.value
         * @param {ReactComponent} parentComponent 时间选择器实例
         */
        getDefaultProps: function () {
            return {
                axis: {x: -1, y: -1},
                value: '[]',
                parentComponent: {}
            };
        },
        render() {
            var mergedValue = tools.getMergedValues(tools.parseValue(this.props.value)[this.props.axis.y])
            var text = tools.getRangeIntro(this.props.axis.x, this.props.axis.x);
            if (mergedValue.length) {
                for (var i = 0; i < mergedValue.length; i++) {
                    if (this.props.axis.x < mergedValue[i].begin || this.props.axis.x > mergedValue[i].end) continue;
                    text = mergedValue[i].value
                        ? mergedValue[i].value : tools.getRangeIntro(mergedValue[i].begin, mergedValue[i].end);
                }
            } 
            return (<div className="fcui2-schedule-normal-legend-layer">{text}</div>);
        }
    });

});
