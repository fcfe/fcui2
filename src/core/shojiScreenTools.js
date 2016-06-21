/**
 * ShojiScreen 工具集
 * @author Brian Li
 * @email lbxxlht@163.com
 * @author 0.0.2.1
 */
define(function (require) {


    var fcui2 = require('./util').getNamespace('___fcui2___');


    return {

        /**
         * 向全局按钮队列中添加一个按钮，只操作队列，不进行其他任何操作
         * @interface addExpandButton
         * @param {HtmlElement} dom ShojiScreen的expand按钮
         */
        addExpandButton: function (dom) {
            if (!dom) return;
            fcui2.shojiScreenExpandButtonArray = fcui2.shojiScreenExpandButtonArray instanceof Array
                ? fcui2.shojiScreenExpandButtonArray : [];
            var arr = fcui2.shojiScreenExpandButtonArray;
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] === dom) return;
            }
            arr.push(dom);
        },

        /**
         * 从全局按钮队列中移除一个按钮，只操作队列，不进行其他任何操作
         * @interface removeExpandButton
         * @param {HtmlElement} dom ShojiScreen的expand按钮
         */
        removeExpandButton: function (dom) {
            if (!dom) return;
            fcui2.shojiScreenExpandButtonArray = fcui2.shojiScreenExpandButtonArray instanceof Array
                ? fcui2.shojiScreenExpandButtonArray : [];
            var arr = fcui2.shojiScreenExpandButtonArray;
            var result = [];
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] === dom) {continue;}
                result.push(arr[i]);
            }
            fcui2.shojiScreenExpandButtonArray = result;
        },

        /**
         * 刷新所有可用按钮的位置
         * @interface freshExpandButton
         */
        freshExpandButton: function () {
            fcui2.shojiScreenExpandButtonArray = fcui2.shojiScreenExpandButtonArray instanceof Array
                ? fcui2.shojiScreenExpandButtonArray : [];
            var arr = fcui2.shojiScreenExpandButtonArray;
            for (var i = 0; i < arr.length; i++) {
                arr[i].style.top = ((i + 1) * 51 + 50) + 'px';
            }
        }
    };

});
