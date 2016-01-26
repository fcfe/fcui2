define(function (require) {
    return {
        /**
         * 获取dom节点的位置
         *
         * @param {HtmlElement} el dom节点
         * @return {Object} 位置对象，left、top相对于body左上角；x、y相对于可见区域左上角;
         */
        getDOMPosition: function (el) {
            var x = 0, y = 0;
            while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
                x += el.offsetLeft - el.scrollLeft;
                y += el.offsetTop - el.scrollTop;
                el = el.offsetParent;
            }
            return {
                x: x,
                y: y,
                left: x + document.body.scrollLeft,
                top: y + document.body.scrollTop
            }
        }
    }
});