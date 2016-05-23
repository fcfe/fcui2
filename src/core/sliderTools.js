define(function (require) {


    function getContainerWidth(me) {
        var width = '';
        if (me.props.hasOwnProperty('width')) {
            width = me.props.width;
        }
        else if (me.props.hasOwnProperty('style') && me.props.style.hasOwnProperty('width')) {
            width = me.props.width;
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
