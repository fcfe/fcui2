/**
 * Layer 工具集
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2.1
 */
define(function (require) {

    var util = require('./util');

    return {
        /**
         * 计算Layer的位置
         * @interface getLayerPosition
         * @param {HtmlElement} layer 浮层dom容器
         * @param {HtmlElement} anchor 锚点dom
         * @param {string} layerLocation 浮层显示位置配置
         * @return {LayerPosition} 显示结果
         * @note
         *
         * ####layerLocation配置说明
         *
         * #####1 展开方向配置：展开方向配置有自适应的功能，比如左侧展不开，就向右展开。
         *
         * ######1.1 字段含义
         * *     top：从anchor的上边框向上展开layer，展开后layer下边框与anchor上边框重合
         * *  bottom：从anchor的下边框向下展开layer，展开后layer上边框与anchor下边框重合
         * *    left：从anchor的右边框向左展开layer，展开后layer右边框与anchor右边框在一条线上
         * *   right：从anchor的左边框向右展开layer，展开后layer左边框与anchor左边框在一条线上
         *      
         * ######1.2 解析原则
         * 1.2.1
         *
         * top和bottom是一对，放在一起分析，与left、right无关。
         * 1.2.2
         * 如果配置中只包含top，不包含bottom，则按照top形式展开，此时没有自适应功能，反之亦然；left、right类似。
         *
         * 1.2.3
         *
         * 如果配置中同时出现top和bottom，且top先出现，则优先按照top展开；如果上方放不下layer，则按照bottom展开。
         *
         * ######1.3 展开位置
         * 使用展开方向配置，layer展开后的具体位置，只能有四种可能，这四种可能会被映射成时钟方向配置结果，
         * 通过返回值返回。
         *
         * #####2 时钟方向配置：layer的最终位置在anchor的n点钟方向，时钟方向配置没有自适应功能。
         * 
         * ######2.1 layer左下角与anchor左上角重合
         *                         +--------------+
         *                         |       1      |
         *                         |              |
         *                         +--------------+
         *                         | anchor |
         *                         +--------+
         * ######2.2 layer左下角与anchor右上角重合
         *                                  +--------------+
         *                                  |       2      |
         *                                  |              |
         *                         +--------+--------------+
         *                         | anchor |
         *                         +--------+
         * ######2.3 layer左下角与anchor右下角重合
         *                                  +--------------+
         *                         +--------|       3      |
         *                         | anchor |              |
         *                         +--------+--------------+
         * ######2.3.5 layer在anchor右侧垂直居中的位置
         *                                  +--------------+
         *                                  |              |
         *                                  |              |
         *                         +--------+              |
         *                         | anchor |      3.5     |
         *                         +--------+              |
         *                                  |              |
         *                                  |              |
         *                                  +--------------+
         * ######2.4 layer左上角与anchor右上角重合         
         *                         +--------+--------------+
         *                         | anchor |       4      |
         *                         +--------|              |
         *                                  +--------------+
         * ######2.5 layer左上角与anchor右下角重合
         *                         +--------+
         *                         | anchor |
         *                         +--------+--------------+
         *                                  |       5      |
         *                                  |              |
         *                                  +--------------+
         * ######2.6 layer左上角与anchor左下角重合
         *                         +--------+
         *                         | anchor |
         *                         +--------------+
         *                         |       6      |
         *                         |              |
         *                         +--------------+
         * ######2.6.5 layer在anchor下方水平居中
         *                         +--------+
         *                         | anchor |
         *                      +--------------+
         *                      |      6.5     |
         *                      |              |
         *                      +--------------+
         * ######2.7 layer右上角与anchor右下角重合
         *                         +--------+
         *                         | anchor |
         *                   +--------------+
         *                   |       7      |
         *                   |              |
         *                   +--------------+
         * ######2.8 layer右上角与anchor左下角重合
         *                         +--------+
         *                         | anchor |
         *          +--------------+--------+
         *          |       8      |
         *          |              |
         *          +--------------+
         * ######2.9 layer右上角和anchor左上角重合
         *          +--------------+--------+
         *          |       9      | anchor |
         *          |              |--------+ 
         *          +--------------+
         * ######2.9.5 layer右上角和anchor左上角重合
         *          +--------------+
         *          |              |
         *          |              |
         *          |              +--------+
         *          |      9.5     | anchor | 
         *          |              +--------+
         *          |              |
         *          |              |
         *          +--------------+
         * ######2.10 layer右下角与anchor左下角重合
         *          +--------------+
         *          |      10      |--------+
         *          |              | anchor |
         *          +--------------+--------+
         * ######2.11 layer右下角与anchor左上角重合
         *          +--------------+
         *          |      11      |
         *          |              |
         *          +--------------+--------+
         *                         | anchor |
         *                         +--------+
         * ######2.12 layer右下角与anchor右上角重合
         *                   +--------------+
         *                   |      12      |
         *                   |              |
         *                   +--------------+
         *                         | anchor |
         *                         +--------+
         * ######2.12.5 layer在anchor上方水平居中
         *                      +--------------+
         *                      |     12.5     |
         *                      |              |
         *                      +--------------+
         *                         | anchor |
         *                         +--------+
         */
        /**
         * @structure LayerPosition
         * @param {Number} left layer显示的left坐标
         * @param {Number} top layer显示的top坐标
         * @param {Number} clock layer相对与anchor的时钟位置
         */ 
        getLayerPosition: function (layer, anchor, layerLocation, skin) {
            // 准备数据
            var layerHeight = layer.offsetHeight;
            var layerWidth = layer.offsetWidth;
            var anchorHeight = anchor.offsetHeight;
            var anchorWidth = anchor.offsetWidth;
            var anchorPosition = util.getDOMPosition(anchor);
            var tempPosition = {
                top: anchorPosition.top - layerHeight,
                bottom: anchorPosition.top + anchorHeight,
                left: anchorPosition.left + anchorWidth - layerWidth,
                right: anchorPosition.left
            };
            var dTop = skin === 'oneux4' ? 4 : 0;
            var clockPosition = {
                '1': [tempPosition.right, tempPosition.top],
                '2': [tempPosition.right + anchorWidth, tempPosition.top],
                '3': [tempPosition.right + anchorWidth, tempPosition.bottom - layerHeight + 1],
                '3.5': [tempPosition.right + anchorWidth, anchorPosition.top + anchorHeight / 2 - layerHeight / 2],
                '4': [tempPosition.right + anchorWidth, anchorPosition.top],
                '5': [tempPosition.right + anchorWidth, tempPosition.bottom + 1],
                '6': [tempPosition.right, tempPosition.bottom],
                '6.5': [anchorPosition.left + anchorWidth / 2 - layerWidth / 2, tempPosition.bottom],
                '7': [tempPosition.left, tempPosition.bottom],
                '8': [anchorPosition.left - layerWidth, tempPosition.bottom],
                '9': [anchorPosition.left - layerWidth, anchorPosition.top],
                '9.5': [anchorPosition.left - layerWidth, anchorPosition.top + anchorHeight / 2 - layerHeight / 2],
                '10': [anchorPosition.left - layerWidth, tempPosition.bottom - layerHeight + 1],
                '11': [anchorPosition.left - layerWidth, tempPosition.top],
                '12': [tempPosition.left, tempPosition.top],
                '12.5': [anchorPosition.left + anchorWidth / 2 - layerWidth / 2, tempPosition.top]
            };
            // 时钟定位
            var clock = '';
            var tmparr = layerLocation.split(' ');
            for (var i = 0; i < tmparr.length; i++) {
                var key = tmparr[i];
                if (!isNaN(key) && clockPosition.hasOwnProperty(key)) {
                    clock = key;
                    break;
                }
            }
            if (clock !== '') {
                if (clock === '1' || clock === '12') {
                    dTop = -dTop;
                }
                else if (clock === '6' || clock === '7') {
                    // do nothing
                }
                else {
                    dTop = 0;
                }
                return {
                    left: clockPosition[clock][0],
                    top: clockPosition[clock][1] + dTop,
                    clockPosition: clock
                };
            }
            // 展开定位
            var topIndex = layerLocation.indexOf('top');
            var bottomIndex = layerLocation.indexOf('bottom');
            var leftIndex = layerLocation.indexOf('left');
            var rightIndex = layerLocation.indexOf('right');
            var result = {
                left: -9999,
                top: -9999,
                clockPosition: ''
            };
            // 只在上方显示
            if (topIndex > -1 && bottomIndex < 0) { 
                result.top = tempPosition.top;
            }
            // 只在下方显示
            else if (bottomIndex > -1 && topIndex < 0) {
                result.top = tempPosition.bottom;
            }
            // 上方优先显示
            else if (topIndex < bottomIndex) {
                result.top = anchorPosition.y - layerHeight > 0 ? tempPosition.top : tempPosition.bottom;
            }
            // 下方优先显示
            else {
                result.top = anchorPosition.y + anchorHeight + layerHeight >= document.documentElement.clientHeight
                    ? tempPosition.top : tempPosition.bottom;
            }
            // 只在左侧显示
            if (leftIndex > -1 && rightIndex < 0) {
                result.left = tempPosition.left;
            }
            // 只在右侧显示
            else if (rightIndex > -1 && leftIndex < 0) {
                result.left = tempPosition.right;
            }
            // 左侧优先显示
            else if (leftIndex < rightIndex) {
                result.left = anchorPosition.left + anchorWidth - layerWidth > 0
                    ? tempPosition.left : tempPosition.right
            }
            // 右侧优先显示
            else {
                result.left = anchorPosition.x + layerWidth >= document.documentElement.clientWidth
                    ? tempPosition.left : tempPosition.right;
            }
            for (var tmpkey in clockPosition) {
                if (result.left === clockPosition[tmpkey][0] && result.top === clockPosition[tmpkey][1]) {
                    result.clockPosition = tmpkey;
                    break;
                }
            }
            if (result.clockPosition === '1' || result.clockPosition === '12') {
                dTop = -dTop;
            }
            else if (result.clockPosition === '6' || result.clockPosition === '7') {
                // do nothing
            }
            else {
                dTop = 0;
            }
            result.top += dTop;
            return result;
        }
    };

});
