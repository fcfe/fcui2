define(function (require) {

    var util = require('./util');

    return {
        /**
         * 计算Layer的位置
         *
         * @param {HtmlElement} layer 浮层dom容器
         * @param {HtmlElement} anchor 锚点dom
         * @param {string} layerLocation 浮层显示位置配置
         * @return {object} 显示结果
         *
         * layerLocation说明
         *   (1)展开方向配置：展开方向配置有自适应的功能，比如左侧展不开，就向右展
         *      top：从anchor的上边框向上展开layer，展开后layer下边框与anchor上边框重合
         *      bottom：从anchor的下边框向下展开layer，展开后layer上边框与anchor下边框重合
         *      left：从anchor的右边框向左展开layer，展开后layer右边框与anchor右边框在一条线上
         *      right：从anchor的左边框向右展开layer，展开后layer左边框与anchor左边框在一条线上
         *   (2)时钟方向配置：layer的最终位置在anchor的n点钟方向，时钟方向配置没有自适应功能
         *      1：layer左下角与anchor左上角重合
         *                         +--------------+
         *                         |              |
         *                         |              |
         *                         +--------------+
         *                         | anchor |
         *                         +--------+
         *      2：layer左下角与anchor右上角重合
         *                                  +--------------+
         *                                  |              |
         *                                  |              |
         *                         +--------+--------------+
         *                         | anchor |
         *                         +--------+
         *      3：layer左下角与anchor右下角重合
         *                                  +--------------+
         *                         +--------|              |
         *                         | anchor |              |
         *                         +--------+--------------+
         *      4：layer左上角与anchor右上角重合         
         *                         +--------+--------------+
         *                         | anchor |              |
         *                         +--------|              |
         *                                  +--------------+
         *      5：layer左上角与anchor右下角重合
         *                         +--------+
         *                         | anchor |
         *                         +--------+--------------+
         *                                  |              |
         *                                  |              |
         *                                  +--------------+
         *      6：layer左上角与anchor左下角重合
         *                         +--------+
         *                         | anchor |
         *                         +--------------+
         *                         |              |
         *                         |              |
         *                         +--------------+
         *      7：layer右上角与anchor右下角重合
         *                         +--------+
         *                         | anchor |
         *                   +--------------+
         *                   |              |
         *                   |              |
         *                   +--------------+
         *      8：layer右上角与anchor左下角重合
         *                         +--------+
         *                         | anchor |
         *          +--------------+--------+
         *          |              |
         *          |              |
         *          +--------------+
         *      9：layer右上角和anchor左上角重合
         *          +--------------+--------+
         *          |              | anchor |
         *          |              |--------+ 
         *          +--------------+
         *      10：layer右下角与anchor左下角重合
         *          +--------------+
         *          |              |--------+
         *          |              | anchor |
         *          +--------------+--------+
         *      11：layer右下角与anchor左上角重合
         *          +--------------+
         *          |              |
         *          |              |
         *          +--------------+--------+
         *                         | anchor |
         *                         +--------+
         *      12：layer右下角与anchor右上角重合
         *                   +--------------+
         *                   |              |
         *                   |              |
         *                   +--------------+
         *                         | anchor |
         *                         +--------+
         *  (3)显示原则：
         *      // 展开方向
         *      top和bottom是一对，放在一起分析，与left、right无关；
         *      如果只有top，没有bottom，则按照top展开，反之亦然；
         *      如果同时出现top和bottom，且先出现top，则优先按照top展开，空间放不下layer，则按照bottom展开
         *      left、right跟top、bottom原则一致；
         *      // 时钟方向
         *      优先级比展开方向配置高，且互斥，如果配置多个时钟位置，按照第一个配置显示
         *      // 内部原则
         *      展开方向配置，最终在内部会转成时钟方向配置，并将时钟方向通过result返回
         *  (4)显示数据结构
         *      return.left {number} layer最终显示的left
         *      return.top {number} layer最终显示的top
         *      return.clock {number} 最终layer的时钟位置
         */
        getLayerPosition: function (layer, anchor, layerLocation) {
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
            var clockPosition = {
                '1': [tempPosition.right, tempPosition.top],
                '2': [tempPosition.right + anchorWidth, tempPosition.top],
                '3': [tempPosition.right + anchorWidth, tempPosition.bottom - layerHeight + 1],
                '4': [tempPosition.right + anchorWidth, anchorPosition.top],
                '5': [tempPosition.right + anchorWidth, tempPosition.bottom + 1],
                '6': [tempPosition.right, tempPosition.bottom],
                '7': [tempPosition.left, tempPosition.bottom],
                '8': [anchorPosition.left - layerWidth, tempPosition.bottom],
                '9': [anchorPosition.left - layerWidth, anchorPosition.top],
                '10': [anchorPosition.left - layerWidth, tempPosition.bottom - layerHeight + 1],
                '11': [anchorPosition.left - layerWidth, tempPosition.top],
                '12': [tempPosition.left, tempPosition.top]
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
                return {
                    left: clockPosition[clock][0],
                    top: clockPosition[clock][1],
                    clockPosition: clock
                }
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

            return result;
        }
    };

});
