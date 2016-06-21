/**
 * Table 工具集
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2.1
 */
define(function (require) {


    var STYLES_MERGE_FROM_CONF_TO_PROPS = {
        width: 'width',
        align: 'textAlign',
        verticalAlign: 'verticalAlign',
        color: 'color'
    };


    return {


        /**
         * 计算选中hash中item个数
         * @interface getSelectedCount
         * @param {Object|number} obj 选中hash，-1表示全选
         * @return {Number} 选中的item个数，即obj键的个数，-1为全选
         */
        getSelectedCount: function (obj) {
            if (obj === -1) return -1;
            var n = 0;
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) n++;
            }
            return n;
        },


        /**
         * 表格是否含有数据
         * @interface haveDate
         * @param {ReactComponent} me table组件实例
         * @return {Boolean} 判断结果，如果不配列或不配数据源，都是true
         */
        haveDate: function (me) {
            var config = me.props.fieldConfig instanceof Array ? me.props.fieldConfig : [];
            var datasource = me.props.datasource instanceof Array ? me.props.datasource : [];
            // 没有数据源
            return datasource.length > 0 && config.length > 0;
        },


        /**
         * 从table的value中获取选中hash
         * @interface getSelectedHash
         * @param {string} value table的value值
         * @return {object|number} 选中的行的index hash，如果全选返回-1
         */
        getSelectedHash: function (value) {
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
         * 获取行的选中状态
         * @interface getRowSelectedState
         * @param {Number} row 行号
         * @param {String} value table的value
         * @return {Number} 选中状态：-1未选中；0选中；1半选中
         */
        getRowSelectedState: function (row, value) {
            var selectHash = this.getSelectedHash(value);
            var indeterminate = {};
            value = typeof value === 'string' ? JSON.parse(value) : {}; 
            if (value.indeterminate instanceof Array) {
                for (var i = 0; i < value.indeterminate.length; i++) indeterminate[value.indeterminate[i]] = true;
            }
            if (selectHash === -1 || selectHash[row]) return 0;
            if (indeterminate[row]) return 1;
            return -1;
        },

        /**
         * 更新选中集
         * @interface updateSelected
         * @param {number} index 选择器的行号
         * @param {boolean} checked 选择器的选中状态
         * @param {string} selectMode 快捷选择方式
         * @param {string} tableValue table的value
         * @param {Array} datasource 表格数据源
         * @return {Array|number} 选中行的数组，如果全选，返回-1
         */
        updateSelected: function (index, checked, selectMode, tableValue, datasource) {
            var result = [];
            var selected = this.getSelectedHash(tableValue);
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
         * 单元格属性工厂
         * @interface tdPropsFactory
         * @param {Object} conf 单元格所在列的配置
         * @param {Object} item 单元格所在行的数据源
         * @param {ReactComponent} me table组件实例
         * @param {number} row 单元格行索引
         * @param {number } column 单元格列索引
         * @return {Object} 传入单元格渲染器的props
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
                props.content = conf.content(item, row, column, me);
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
            for (var key in STYLES_MERGE_FROM_CONF_TO_PROPS) {
                var styleName = STYLES_MERGE_FROM_CONF_TO_PROPS[key];
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
         * 类配置工厂，主要用于嵌入选择器配置
         * @interface fieldConfigFactory
         * @param {ReactComponent} me table实例
         * @param {Object} renderers 外部导入的默认渲染器，由于某些渲染器可能会调用此文件，造成循环加载，所以从外部导入
         * @return {Array} 列配置
         */
        fieldConfigFactory: function (me, renderers) {
            var fields = [];
            var hasSelector = false;
            var selectorConfig = {
                isSelector: true,
                width: 60,
                renderer: renderers.selectorItem,
                thRenderer: renderers.selectorHeader,
                prepare: function (props, item, row, column, me) {
                    props.onRowSelect = me.onRowSelect;
                }
            };
            for (var i = 0; i < me.props.fieldConfig.length; i++) {
                var item = me.props.fieldConfig[i];
                if (item.isSelector) {
                    hasSelector = true;
                    var newItem = {
                        isSelector: true,
                        maxWidth:60,
                        renderer: renderers.selectorItem,
                        thRenderer: renderers.selectorHeader,
                        prepare: (function (oldPrepare) {
                            return function (props, item, row, column, me) {
                                props.onRowSelect = me.onRowSelect;
                                props.disabled = me.props.disabled;
                                typeof oldPrepare === 'function' && oldPrepare(props, item, row, column, me);
                            };
                        })(item.prepare)
                    };
                    newItem.width = isNaN(item.width) ? 60 : item.width;
                    fields.push(newItem);
                }
                else {
                    fields.push(item);
                }
            }
            if (hasSelector) return fields;
            if (me.props.flags && me.props.flags.showSelector) {
                fields.unshift(selectorConfig);
            }
            return fields;
        }
    };
})
