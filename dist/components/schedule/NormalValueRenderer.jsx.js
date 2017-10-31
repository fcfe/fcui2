/**
 * 时间选择器值默认渲染器
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2.1
 */
define(function (require) {

    var React = require('react');
    var tools = require('../../core/scheduleTools');

    return React.createClass({
        // @override
        /**
         * @properties
         * @param {Function} prepare 等同于schedule.props.valuePrepare
         * @param {String} value 等同于schedule.props.value
         * @param {ReactComponent} parentComponent 时间选择器实例
         */
        getDefaultProps: function getDefaultProps() {
            return {
                prepare: new Function(),
                value: '[]',
                parentComponent: {}
            };
        },
        render: function render() {
            return React.createElement(
                'div',
                { className: 'value-layer' },
                labelFactory(this.props.value, this.props.prepare)
            );
        }
    });
    /**
     * @fire schedule valuePrepare
     * @param {Object} param 回调对象
     * @param {Object} param.style 渲染value的样式对象
     * @param {String} param.text 将要显示的文本
     * @param {Number} param.day value块所在星期
     * @param {Number} param.begin value块起始时间
     * @param {Number} param.end value块结束时间
     */
    function labelFactory(value, prepare) {
        value = tools.parseValue(value);
        var doms = [];
        for (var i = 0; i < value.length; i++) {
            var labels = tools.getMergedValues(value[i]);
            for (var j = 0; j < labels.length; j++) {
                var label = labels[j];
                var added = true;
                var param = {
                    style: {
                        top: i * 24 + 1,
                        left: label.begin * 24 + 1,
                        height: 23,
                        width: (label.end - label.begin + 1) * 24
                    },
                    text: label.value === '' ? tools.getRangeIntro(label.begin, label.end) : label.value,
                    day: i + 1,
                    begin: label.begin,
                    end: label.end
                };
                typeof prepare === 'function' && (added = prepare(param));
                if (added === false) continue;
                doms.push(React.createElement(
                    'div',
                    { key: i + '-' + j, style: param.style },
                    param.text
                ));
            }
        }
        return doms.length > 0 ? doms : '';
    }
});