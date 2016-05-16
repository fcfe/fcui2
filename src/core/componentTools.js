define(function (require) {


    return {

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
                style: me.props.hasOwnProperty('style') ? me.props.style : undefined,
                className: 'fcui2-' + type
            };
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
            return result;
        }
    };


})
