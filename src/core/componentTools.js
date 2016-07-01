/**
 * 组件公共方法
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2.1
 */
define(function (require) {

    var _ = require('underscore');

    var MERGE_FROM_PROPS_TO_STYLE = [
        'width',
        'minWidth',
        'maxWidth',
        'height',
        'minHeight',
        'maxHeight'
    ];


    return {

        /**
         * 一个空函数
         * @interface noop
         * @return {Function} 空函数
         */
        noop: function () {

        },

        /**
         * 从props和props.style中取值
         * @param {Object} props 实例属性结合
         * @param {string} key 要查找的键
         * @param {Any} defaultValue 如果props[key]和props.style[key]都不存在，返回此值
         * @return {Any} 待查找的值
         * @interface getValueFromPropsAndStyle
         */
        getValueFromPropsAndStyle: function (props, key, defaultValue) {
            if (props.hasOwnProperty(key)) return props[key];
            if (props.hasOwnProperty('style') && props.style.hasOwnProperty(key)) return props.style[key];
            return defaultValue;
        },

        /**
         * 弹出Layer方法工厂
         * @param {ReactComponent} me 包含Layer组件的组件实例
         * @param {String} flag 控制Layer显示隐藏的开关名称，此开关必须在me的state中
         * @return {Function} 弹出Layer的方法
         * @interface openLayerHandlerFactory
         */
        openLayerHandlerFactory: function (me, flag) {
            return function () {
                if (me.props.disabled) return;
                var obj = {};
                obj[flag] = true;
                me.setState(obj);
            };
        },

        /**
         * 关闭Layer方法工厂
         * @param {ReactComponent} me 包含Layer组件的组件实例
         * @param {String} flag 控制Layer显示隐藏的开关名称，此开关必须在me的state中
         * @return {Function} 关闭Layer的方法
         * @interface closeLayerHandlerFactory
         */
        closeLayerHandlerFactory: function (me, flag) {
            return function () {
                setTimeout(function () {
                    if (me.state.mouseenter || (me.refs.layer && me.refs.layer.state.mouseenter)) return;
                    var obj = {};
                    obj[flag] = false;
                    me.setState(obj);
                }, 200);
            };
        },

        /**
         * 创建组件根容器通用属性集
         * @param {string} type 组件类型
         * @param {Object} me 组件实例
         * @param {Object} options 配置项
         * @param {Array.<String>} options.mergeFromProps 导入配置。
         * 此配置中的字符串代表me.props的key，所有me.props[key]将被复制到result中。若result中已经存在key，则跳过。
         * @param {Object} options.merge 合并配置。
         * options.merge最终将与result合并，冲突的键不合并。此配置优先级低于options.mergeFromProps。
         * @return {Object} 根容器通用属性集
         * @interface containerBaseProps
         */
        /**
         * @properties
         * @param {String} ref 组件根容器索引，默认为'container'
         * @param {String} skin 组件皮肤此属性最终加在组件根容器的class上，例如：fcui2-componentname-skinname
         * @param {String} className 外接class此属性最终加在组件根容器的class上
         * @param {Object} style 外接style此属性最终加在组件根容器的style上
         * @param {boolean} disabled 组件是否可用
         */
        containerBaseProps: function (type, me, options) {
            // 原始集
            var result = {
                ref: 'container',
                style: {},
                className: 'fcui2-' + type
            };
            var key = '';
            // 处理style，潜克隆一份，防止直接修改me.props.style导致报错
            if (me.props.hasOwnProperty('style')) {
                for (key in me.props.style) {
                    if (!me.props.style.hasOwnProperty(key)) continue;
                    result.style[key] = me.props.style[key];
                }
            }
            // class
            result.className += typeof me.props.className === 'string' && me.props.className.length
                ? (' ' + me.props.className) : '';
            // skin
            if (typeof me.props.skin === 'string' && me.props.skin.length) {
                result.className += ' fcui2-' + type + '-' + me.props.skin;
            }
            else {
                result.className += ' fcui2-' + type + '-normal';
            }
            // reject and disable
            if (me.state.isValid === false) {
                result.className += ' fcui2-' + type + '-reject';
            }
            else if (me.props.disabled) {
                result.className += ' fcui2-' + type + '-disabled';
            }

            // 处理options.mergeFromProps
            options = options || {};
            if (options.mergeFromProps instanceof Array) {
                for (var i = 0; i < options.mergeFromProps.length; i++) {
                    key = options.mergeFromProps[i];
                    if (me.props.hasOwnProperty(key) && !result.hasOwnProperty(key)) {
                        result[key] = me.props[key];
                    }
                }
            }
            // 处理options.merge
            if (options.hasOwnProperty('merge')) {
                for (key in options.merge) {
                    if (options.merge.hasOwnProperty(key) && !result.hasOwnProperty(key)) {
                        result[key] = options.merge[key];
                    }
                }
            }
            // 处理options.style
            if (options.hasOwnProperty('style')) {
                for (key in options.style) {
                    if (options.style.hasOwnProperty(key) && !result.style.hasOwnProperty(key)) {
                        result.style[key] = options.style[key];
                    }
                }
            }
            // 兼容：将部分props属性下降到result.style中
            for (var j = 0; j < MERGE_FROM_PROPS_TO_STYLE.length; j++) {
                key = MERGE_FROM_PROPS_TO_STYLE[j];
                if (!result.style.hasOwnProperty(key) && me.props.hasOwnProperty(key)) {
                    result.style[key] = me.props[key];
                }
            }
            return result;
        }
    };
});
