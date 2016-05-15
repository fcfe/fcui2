define(function (require) {


    return {

        /**
         * 创建组件通用根容器属性集合
         *
         * @param {string} type 组件类型
         * @param {Object} props 组件props
         * @param {Object} options 配置项
         * @return {Object} 根容器基本配置
         */
        containerBaseProps: function (type, props, options) {
            // 原始集
            var result = {
                ref: 'container',
                style: props.hasOwnProperty('style') ? props.style : undefined,
                className: 'fcui2-' + type
            };
            // 处理className、disabled、skin
            result.className += typeof props.className === 'string' && props.className.length
                ? (' ' + props.className) : '';
            if (props.disabled) {
                result.className += ' fcui2-' + type + '-disabled';
            }
            else if (typeof props.skin === 'string' && props.skin.length) {
                result.className += ' fcui2-' + type + '-' + props.skin;
            }
            // 处理options.mergeFromProps
            options = options || {};
            if (options.mergeFromProps instanceof Array) {
                for (var i = 0; i < options.mergeFromProps; i++) {
                    var key = options.mergeFromProps[i];
                    if (props.hasOwnProperty(key) && !result.hasOwnProperty(key)) {
                        result[key] = props[key];
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
            return result;
        }
    };


})
