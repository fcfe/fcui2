/**
 * fixed helper
 * 负责监听scroll事件，并对筛选器内的所有DOM进行判断
 * 当DOM在屏幕上的top小于设定后，将DOM的位置fixed掉
 *
 * @file DOM固定辅助器
 */
define(function (require) {
    
    var util = require('./util.es6');

    // 需要刷新的配置，数组索引决定了fixed后的zIndex
    var elements = [];

    // 注册全局scroll，已优化
    var scrollTimer = null;
    var resizeTimer = null;
    window.onscroll = function () {
        if (scrollTimer) {
            clearTimeout(scrollTimer);
        }
        scrollTimer = setTimeout(scrollHandler, 1000 / 60);
    };
    window.onresize = function () {
        if (resizeTimer) {
            clearTimeout(resizeTimer);
        }
        resizeTimer = setTimeout(resizeTimer, 1000 / 60);
    };

    // scroll事件句柄
    function scrollHandler() {
        var scrollTop = $(window).scrollTop();
        var selector = '';
        for (var i = 0; i < elements.length; i++) {
            update(
                elements[i].key,
                scrollTop,
                elements[i].value,
                elements[i].zIndex == null ? i : elements[i].zIndex
            );
        }
    }

    //resize句柄
    function resizeTimer() {
        for (var i = 0; i < elements.length; i++) {
            record(elements[i].key);
        }
    }

    // 对每个配置做更新
    function update(selector, scrollTop, fixedTop, zIndex) {
        var doms = $(selector);
        if (doms.length === 0) {
            return;
        }
        doms.each(function () {
            var me = $(this);
            var pos = util.getDOMPosition(this);
            if (scrollTop - this.oldPos + fixedTop < 0 && this.isFixed) {
                this.isFixed = false;
                me.removeClass('fcui2-fixed-with-scroll').css({
                    top: this.oldTop,
                    zIndex: this.oldzIndex
                });
                return;
            }
            if (pos.y < fixedTop) {
                this.isFixed = true;
                me.addClass('fcui2-fixed-with-scroll').css({
                    top: fixedTop,
                    zIndex: zIndex
                });
            }
        });
    }

    function record(selector) {
        $(selector).each(function () {
            var me = $(this);
            this.oldTop = me.css('top');
            this.oldzIndex = me.css('zIndex');
            this.oldPos = util.getDOMPosition(this).top;
        });
    }

    return {
        add: function (selector, top, zIndex) {
            elements.push({
                key: selector,
                value: isNaN(top) ? 0 : parseInt(top, 10),
                zIndex: !isNaN(zIndex) ? parseInt(zIndex, 10): null
            });
            record(selector);
        },
        remove: function (selector) {
            var arr = [];
            for (var i = 0; i < elements.length; i++) {
                if (elements[i].key === selector) {
                    continue;
                }
                arr.push(elements[i]);
            }
            elements = arr;
        },
        update: function () {
            scrollHandler();
        }
    }
});