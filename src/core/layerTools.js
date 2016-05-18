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
         *
         * layerLocation说明
         *  （1）字段含义：
         *      top：从anchor的上边框向上展开layer
         *      bottom：从anchor的下边框向下展开layer
         *      left：从anchor的右边框向左展开layer
         *      right：从anchor的左边框向右展开layer
         *  （2）显示原则：
         *      top和bottom放在一起分析，与left、right无关；
         *      left和right是一对，放在一起分析，与top、button无关；
         *      如果只有top，没有bottom，则按照top显示，反之亦然；
         *      如果同时出现top和bottom，则top优先，若top形式显示不下layer，则换成bottom，反之亦然；
         *      left、right的显示跟top、bottom的显示原则一致。
         * 显示数据结构
         *      return.left {number} layer最终显示的left
         *      return.top {number} layer最终显示的top
         *      return.isLeft {boolean} layer是否按照left形式展开
         *      return.isTop {boolean} layer是否按照top形式展开
         */
        getLayerPosition: function (layer, anchor, layerLocation) {

            var layerHeight = layer.offsetHeight;
            var layerWidth = layer.offsetWidth;
            var anchorHeight = anchor.offsetHeight;
            var anchorWidth = anchor.offsetWidth;
            var anchorPosition = util.getDOMPosition(anchor);
            var finalPosition = {
                top: anchorPosition.top - layerHeight,
                bottom: anchorPosition.top + anchorHeight - 1,
                left: anchorPosition.left + anchorWidth - layerWidth,
                right: anchorPosition.left
            };
            var result = {
                left: -9999,
                top: -9999
            };
            var topIndex = layerLocation.indexOf('top');
            var bottomIndex = layerLocation.indexOf('bottom');
            var leftIndex = layerLocation.indexOf('left');
            var rightIndex = layerLocation.indexOf('right');

            // 只在上方显示
            if (topIndex > -1 && bottomIndex < 0) { 
                result.top = finalPosition.top;
            }
            // 只在下方显示
            else if (bottomIndex > -1 && topIndex < 0) {
                result.top = finalPosition.bottom;
            }
            // 上方优先显示
            else if (topIndex < bottomIndex) {
                result.top = anchorPosition.y - layerHeight > 0 ? finalPosition.top : finalPosition.bottom;
            }
            // 下方优先显示
            else {
                result.top = anchorPosition.y + anchorHeight + layerHeight >= document.documentElement.clientHeight
                    ? finalPosition.top : finalPosition.bottom;
            }

            // 只在左侧显示
            if (leftIndex > -1 && rightIndex < 0) {
                result.left = finalPosition.left;
            }
            // 只在右侧显示
            else if (rightIndex > -1 && leftIndex < 0) {
                result.left = finalPosition.right;
            }
            // 左侧优先显示
            else if (leftIndex < rightIndex) {
                result.left = anchorPosition.left + anchorWidth - layerWidth > 0
                    ? finalPosition.left : finalPosition.right
            }
            // 右侧优先显示
            else {
                result.left = anchorPosition.x + layerWidth >= document.documentElement.clientWidth
                    ? finalPosition.left : finalPosition.right;
            }

            result.isTop = result.top === finalPosition.top;
            result.isLeft = result.left === finalPosition.left;

            return result;
        }
    };

});
