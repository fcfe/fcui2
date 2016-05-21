/**
 * @file 组件公共方法
 * @author Brian Li
 * @email lbxxlht@163.com
 * @author Han Bing Feng
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

    /**
     * 模拟符合React规则的synthetic event
     * @param {Event} nativeEvent
     * @constructor
     */
    function SyntheticEvent(nativeEvent) {
        _.extend(this, _.pick(nativeEvent, function (prop, key) {
            if (typeof prop === 'function') {
                return false;
            }

            return true;
        }));
        this._nativeEvent = nativeEvent;
    }

    SyntheticEvent.prototype.preventDefault = function () {
        this._nativeEvent.preventDefault();
    };

    SyntheticEvent.prototype.isDefaultPrevented = function () {
        return this._nativeEvent.defaultPrevented;
    };

    return {


        /**
         * 一个空函数
         */
        noop: function () {

        },


        /**
         * 弹出Layer的通用方法，请自定绑定上下文
         */
        openLayerHandler: function () {
            if (this.props.disabled) return;
            this.setState({layerOpen: true});
        },


        /**
         * 关闭Layer的通用方法，请自定绑定上下文
         */
        closeLayerHandler: function () {
            var me = this;
            setTimeout(function () {
                if (me.refs.layer && me.refs.layer.state.mouseenter) return;
                me.setState({layerOpen: false});
            }, 200);
        },


        /**
         * 创建组件通用根容器属性集合
         *
         * @param {string} type 组件类型
         * @param {Object} me 组件实例
         * @param {Object} options 配置项
         * @return {Object} 根容器基本配置
         */
        containerBaseProps: function (type, me, options) {
            // 原始集
            var result = {
                ref: 'container',
                style: {},
                className: 'fcui2-' + type
            };
            // 处理style，潜克隆一份，防止直接修改me.props.style导致报错
            if (me.props.hasOwnProperty('style')) {
                for (var key in me.props.style) {
                    if (!me.props.style.hasOwnProperty(key)) continue;
                    result.style[key] = me.props.style[key];
                }
            }
            // 处理className、disabled、skin
            result.className += typeof me.props.className === 'string' && me.props.className.length
                ? (' ' + me.props.className) : '';
            if (me.state.isValid === false) {
                result.className += ' fcui2-' + type + '-reject';
            }
            else if (me.props.disabled) {
                result.className += ' fcui2-' + type + '-disabled';
            }
            else if (typeof me.props.skin === 'string' && me.props.skin.length) {
                result.className += ' fcui2-' + type + '-' + me.props.skin;
            }
            // 处理options.mergeFromProps
            options = options || {};
            if (options.mergeFromProps instanceof Array) {
                for (var i = 0; i < options.mergeFromProps.length; i++) {
                    var key = options.mergeFromProps[i];
                    if (me.props.hasOwnProperty(key) && !result.hasOwnProperty(key)) {
                        result[key] = me.props[key];
                    }
                }
            }
            // 处理options.merge
            if (options.hasOwnProperty('merge')) {
                for (var key in options.merge) {
                    if (options.merge.hasOwnProperty(key) && !result.hasOwnProperty(key)) {
                        result[key] = options.merge[key];
                    }
                }
            }
            // 处理options.style
            if (options.hasOwnProperty('style')) {
                for (var key in options.style) {
                    if (options.style.hasOwnProperty(key) && !result.style.hasOwnProperty(key)) {
                        result.style[key] = options.style[key];
                    }
                }
            }
            // 兼容：将部分props属性下降到result.style中
            for (var i = 0; i < MERGE_FROM_PROPS_TO_STYLE.length; i++) {
                var key = MERGE_FROM_PROPS_TO_STYLE[i];
                if (!result.style.hasOwnProperty(key) && me.props.hasOwnProperty(key)) {
                    result.style[key] = me.props[key];
                }
            }
            return result;
        },

        SyntheticEvent: SyntheticEvent
    };
})
