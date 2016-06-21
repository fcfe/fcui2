/**
 * Slider 工具集
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2.1
 */
define(function (require) {


    function getContainerWidth(me) {
        var width = '';
        if (me.props.hasOwnProperty('width')) {
            width = me.props.width;
        }
        else if (me.props.hasOwnProperty('style') && me.props.style.hasOwnProperty('width')) {
            width = me.props.style.width;
        }
        else if (me.refs && me.refs.container && me.refs.container.offsetWidth > 0) {
            width = me.refs.container.offsetWidth;
        }
        width += '';
        width = width.replace('px', '');
        if (isNaN(width)) return 200;
        return parseInt(width, 10);
    }

    return {
        /**
         * 根据滑竿配置将值换算成屏幕相对
         * @interface value2position
         * @param {Number} value 某个值
         * @param {ReactComponent} me 滑竿组件实例
         * @param {Number} margin 滑竿坐标轴两侧的margin值
         * @return {Number} 值在坐标轴上的对应坐标
         */
        value2position: function (value, me, margin) {
            var min = isNaN(me.props.min) ? 0 : me.props.min * 1;
            var max = isNaN(me.props.max) ? 100 : me.props.max * 1;
            var width = getContainerWidth(me);
            value = this.displayValue(value, me) * 1;
            if (min > max) {
                var tmp = min;
                min = max;
                max = tmp;
            }
            return margin + (value - min) * (width - margin * 2) / (max - min);
        },
        /**
         * 根据滑竿配置将坐标换算成值
         * @interface position2value
         * @param {Number} pop 滑竿坐标轴上的某一点坐标
         * @param {ReactComponent} me 滑竿组件实例
         * @param {Number} margin 滑竿坐标轴两侧的margin值
         * @return {Number} 坐标轴上坐标对应的值
         */
        position2value: function (pos, me, margin) {
            var min = isNaN(me.props.min) ? 0 : me.props.min * 1;
            var max = isNaN(me.props.max) ? 100 : me.props.max * 1;
            var width = getContainerWidth(me);
            if (min > max) {
                var tmp = min;
                min = max;
                max = tmp;
            }
            return min + (pos - margin) * (max - min) / (width - margin * 2);
        },
        /**
         * 根据滑竿配置将值转换成可显示的值
         * @interface displayValue 
         * @param {Number} value 某个值
         * @param {ReactComponent} 滑竿组件实例
         * @return {String} 符合滑竿配置要求的数字字符串 
         */
        displayValue: function (value, me) {
            var min = isNaN(me.props.min) ? 0 : me.props.min * 1;
            var max = isNaN(me.props.max) ? 100 : me.props.max * 1;
            value = isNaN(value) ? 0 : value * 1;
            if (min > max) {
                var tmp = min;
                min = max;
                max = tmp;
            }
            value = value < min ? min : value;
            value = value > max ? max : value;
            if (me.props.type === 'int') return parseInt(value, 10);
            var fixed = isNaN(me.props.fixed) ? 2 : parseInt(me.props.fixed, 10);
            value = parseFloat(value).toFixed(fixed);
            if (value.indexOf('.') < 0) {
                value += '.';
                while (fixed > 0) {
                    value += '0';
                    fixed--;
                }
            }
            return value;
        }
    }
});
