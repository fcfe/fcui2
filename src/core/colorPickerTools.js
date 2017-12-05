/**
 * ColorPicker 工具集
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2.1
 */
define(function (require) {

    return {

        /**
         * RGB颜色转CSS串
         * @interface RGB2CSS
         * @param {number} r 红色0 - 255
         * @param {number} g 绿色0 - 255
         * @param {number} b 蓝色0 - 255
         * @return {string} CSS颜色串，#FFFFFF
         */
        RGB2CSS: function (r, g, b) {
            r = r.toString(16);
            g = g.toString(16);
            b = b.toString(16);
            r = r.length === 1 ? '0' + r : r;
            g = g.length === 1 ? '0' + g : g;
            b = b.length === 1 ? '0' + b : b;
            return '#' + r + g + b;
        },

        /**
         * CSS串转RGB颜色
         * @interface CSS2RGB
         * @param {string} s CSS颜色#000000，必须是6位
         * @return {Array.<number>} RGB颜色数组，0-255
         */
        CSS2RGB: function (s) {
            s = s.replace('#', '');
            var r = parseInt(s.slice(0, 2), 16);
            var g = parseInt(s.slice(2, 4), 16);
            var b = parseInt(s.slice(4, 6), 16);
            return [r, g, b];
        },

        /**
         * HSL颜色转RGB颜色
         * @interface HSL2RGB
         * @param {number} h 色相
         * @param {number} s 饱和度
         * @param {number} l 亮度
         * @return {Array.<number>} RGB颜色数组，0-255
         */
        HSL2RGB: function (h, s, l){
            var r, g, b;
            if(s === 0){
                r = g = b = l;
            }
            else {
                function hue2rgb(p, q, t){
                    if(t < 0) t += 1;
                    if(t > 1) t -= 1;
                    if(t < 1/6) return p + (q - p) * 6 * t;
                    if(t < 1/2) return q;
                    if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                    return p;
                }
                var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                var p = 2 * l - q;
                r = hue2rgb(p, q, h + 1/3);
                g = hue2rgb(p, q, h);
                b = hue2rgb(p, q, h - 1/3);
            }
            return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
        },

        /**
         * RGB颜色转HSL颜色
         * @interface RGB2HSL
         * @param {number} r 红色0 - 255
         * @param {number} g 绿色0 - 255
         * @param {number} b 蓝色0 - 255
         * @return {Array.<number>} HSL颜色数组，0-1
         */
        RGB2HSL: function (r, g, b){
            r /= 255, g /= 255, b /= 255;
            var max = Math.max(r, g, b), min = Math.min(r, g, b);
            var h, s, l = (max + min) / 2;
            if(max === min){
                h = s = 0;
            }
            else {
                var d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                switch(max){
                    case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                    case g: h = (b - r) / d + 2; break;
                    case b: h = (r - g) / d + 4; break;
                }
                h /= 6;
            }
            return [h, s, l];
        },

        getValueObject: function (value) {
            if (value == null) {
                value = {};
            }
            try {
                value = JSON.parse(value);
            }
            catch (e) {
                value = {
                    css: '#000000',
                    rgb: [0, 0, 0],
                    hsl: [0, 0, 0]
                };
            }
            value.css = typeof value.css !== 'string' ? '#000000' : value.css;
            value.rgb = this.CSS2RGB(value.css);
            value.hsl = this.RGB2HSL(value.rgb[0], value.rgb[1], value.rgb[2]);
            return value;
        }

    }
});
