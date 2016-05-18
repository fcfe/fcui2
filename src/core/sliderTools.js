define(function (require) {


    return {
        value2position: function (value, props, margin) {
            var min = isNaN(props.min) ? 0 : props.min * 1;
            var max = isNaN(props.max) ? 100 : props.max * 1;
            var width = isNaN(props.width) ? 200 : props.width * 1;
            value = this.displayValue(value, props) * 1;
            if (min > max) {
                var tmp = min;
                min = max;
                max = tmp;
            }
            return margin + (value - min) * (width - margin * 2) / (max - min);
        },
        position2value: function (pos, props, margin) {
            var min = isNaN(props.min) ? 0 : props.min * 1;
            var max = isNaN(props.max) ? 100 : props.max * 1;
            var width = isNaN(props.width) ? 200 : props.width * 1;
            if (min > max) {
                var tmp = min;
                min = max;
                max = tmp;
            }
            return min + (pos - margin) * (max - min) / (width - margin * 2);
        },
        displayValue: function (value, props) {
            var min = isNaN(props.min) ? 0 : props.min * 1;
            var max = isNaN(props.max) ? 100 : props.max * 1;
            value = isNaN(value) ? 0 : value * 1;
            if (min > max) {
                var tmp = min;
                min = max;
                max = tmp;
            }
            value = value < min ? min : value;
            value = value > max ? max : value;
            if (props.type === 'int') return parseInt(value, 10);
            var fixed = isNaN(props.fixed) ? 2 : parseInt(props.fixed, 10);
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
