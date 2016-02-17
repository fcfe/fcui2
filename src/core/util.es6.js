define(function (require) {
    var exports = {

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
        },

        /**
         * 获取DOM节点dataset，shit IE9
         *
         * @param {HtmlElement} dom dom节点
         * @return {Object} dataset数据集
         */
        getDataset: function (dom) {
            if (typeof dom.dataset !== 'undefined') {
                return dom.dataset;
            }
            var attrs = dom.attributes;
            var dataset = {};
            for (var i = 0; i < attrs.length; i++) {
                var item = attrs[i];
                var key = item.name;
                if (key.indexOf('data-') !== 0) {
                    continue;
                }
                key = key.slice(5, key.length).replace(/\-(\w)/g, function (all, letter) {
                    return letter.toUpperCase();
                });
                dataset[key] = item.value;
            }
            return dataset;
        },

        /**
         * 自动调整弹出浮层位置，只调整上下，不调整左右
         *
         * @param {HtmlElement} container layer外部的dom容器
         * @param {HtmlElement} layer layer根容器
         * @param {React Node} node layer所在的react组件
         */
        fixedLayerPositionTB: function (container, layer, node) {
            var pos = this.getDOMPosition(container);
            var timer = setInterval(function () {
                var height = layer.offsetHeight;
                if (height === 0) return;
                clearInterval(timer);
                var position = pos.y + container.offsetHeight + height < document.documentElement.clientHeight
                    ? 'bottom-layer' : 'up-layer';
                node.setState({layerPosition: position});
            }, 5);
        }
    };

    return exports;
});
