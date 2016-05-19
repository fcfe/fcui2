define(function (require) {


    var STYLES = {
        align: 'textAlign',
        color: 'color'
    };


    return {


        /**
         * 判断是否有数据
         */
        haveDate: function (me) {
            var config = me.props.fieldConfig instanceof Array ? me.props.fieldConfig : [];
            var datasource = me.props.datasource instanceof Array ? me.props.datasource : [];
            // 没有数据源
            return datasource.length > 0 && config.length > 0;
        },


        /**
         * 从table的value中，获取选中行的数据结构
         *
         * @param {string} value table的value值
         * @return {object | number} 选中的行的index hash，如果全选返回-1
         */
        getSelected: function (value) {
            value = typeof value === 'string' ? JSON.parse(value) : {};
            var selected = {};
            if (value.selected === -1) {
                selected = -1;
            }
            else if (value.selected instanceof Array) {
                for (var i = 0; i < value.selected.length; i++) selected[value.selected[i]] = true;
            }
            return selected;
        },


        /**
         * 更新选中集
         *
         * @param {number} index 选择器的行号
         * @param {boolean} checked 选择器的选中状态
         * @param {string} selectMode 快捷选择方式
         * @param {string} tableValue table的value
         * @param {Array} datasource 表格数据源
         * @return {Array | number} 选中行的数组，如果全选，返回-1
         */
        updateSelected: function (index, checked, selectMode, tableValue, datasource) {
            var result = [];
            var selected = this.getSelected(tableValue);
            // 之前全选，取消一项
            if (selected === -1 && !checked) {
                for (var i = 0; i < datasource.length; i++) {
                    if (i === index) continue;
                    result.push(i);
                }
            }
            // 选中某项
            else if (selected !== -1 && checked) {
                selected[index] = true;
                for (var i = 0; i < datasource.length; i++) {
                    if (!selected[i]) continue;
                    result.push(i);
                }
            }
            // 取消某项
            else if (selected !== -1 && !checked) {
                selected[index] = false;
                for (var i = 0; i < datasource.length; i++) {
                    if (!selected[i]) continue;
                    result.push(i);
                }
            }
            // 全部选中
            if (selectMode === '-1') {
                result = -1;
            }
            // 选中当前页
            else if (selectMode === '-2') {
                result = [];
                for (var i = 0; i < datasource.length; i++) result.push(i);
            }
            // 取消所有
            else if (selectMode === '-3') {
                result = [];
            }

            return result;
        },


        /**
         * 根据fieldConfig的配置生成渲染单元格的props
         *
         * @param {Object} conf 列配置
         * @param {Object} item 数据源
         * @param {Object} me 当前react对象
         * @param {number} row item在datasource的行索引
         * @param {number } column 当前渲染的列索引
         * @return {Object} 用于渲染row行column列的props
         */
        tdPropsFactory: function (conf, item, me, row, column) {
            // 深度克隆fieldConfig
            var props = JSON.parse(JSON.stringify(conf));
            // 导入数据、索引、回调、key
            props.item = item;
            props.row = row;
            props.column = column;
            props.onAction = me.props.onAction;
            props.key = 'column-' + column;
            // 对content域进行特殊处理
            if (typeof conf.content === 'function') {
                props.content = conf.content(item, row, column);
            }
            else if (typeof conf.content === 'string' && item.hasOwnProperty(conf.content)) {
                props.content = item[conf.content];
            }
            else if (!conf.hasOwnProperty('content') && conf.hasOwnProperty('field')) {
                props.content = item[conf.field];
            }
            else if (typeof conf.content !== 'string'){
                props.content = '';
            }
            // 将某些style从conf中挪到props.style
            props.style = props.style || {};
            for (var key in STYLES) {
                var styleName = STYLES[key];
                if (conf.hasOwnProperty(key) && !props.style.hasOwnProperty(styleName)) {
                    props.style[styleName] = conf[key];
                }
            }
            // 处理prepare，将item和props回传给conf.prepare，由prepare以指针形式操作props
            if (typeof conf.prepare === 'function') {
                conf.prepare(props, item, row, column, me);
            }
            props.content = props.content + '';
            return props;
        },


        /**
         * 重新组织fieldConfig
         *
         * @param {Object} me React table 实例
         * @return {Array} 列配置
         */
        fieldConfigFactory: function (me) {
            var fields = [];
            var hasSelector = false;
            var selectorConfig = {
                isSelector: true,
                width:60,
                renderer: require('../components/table/Selector.jsx'),
                thRenderer: require('../components/table/Selector.jsx')
            };
            for (var i = 0; i < me.props.fieldConfig.length; i++) {
                var item = me.props.fieldConfig[i];
                if (item.isSelector) {
                    hasSelector = true;
                    item = selectorConfig;
                }
                fields.push(item);
            }
            if (hasSelector) return fields;
            if (me.props.flags && me.props.flags.showSelector) {
                fields.unshift(selectorConfig);
            }
            return fields;
        }
    };
})
