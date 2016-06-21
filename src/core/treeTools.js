/**
 * Tree 工具集
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2.1
 */
define(function (require) {
    
    return {
        /**
         * 获取Tree节点数据源
         * @interface getLeafItem
         * @param {Array.<TreeItemObject>} datasource Tree数据源
         * @param {Array.<Number>} indexs 节点序列，从树的第一层开始，依照序列从children中检出
         * @return {TreeItemObject} 节点数据源
         */
        getLeafItem: function (datasource, indexs) {
            var result = {children: datasource};
            for (var i = 0; i < indexs.length; i++) {
                var index = parseInt(indexs[i], 10);
                if (isNaN(index)) continue;
                if (result.children instanceof Array && result.children.length > index) {
                    result = result.children[index];
                }
            }
            return result;
        },
        /**
         * 获取Tree节点的选择状态
         * @interface getNodeSelectInfo
         * @param {TreeItemObject} item 节点数据源
         * @param {Object} selectedHash Tree选择状态hash，以item.value为key
         * @param {String} index 节点序列
         * @param {Object} loadCache 树遍历临时hash，由于树遍历时出现相同计算，所以要使用cache以提高效率
         * @return {TreeNodeSelectState} 节点选择状态
         */
        /**
         * @structure TreeNodeSelectState
         * @param {Number} total 子树所有节点个数
         * @param {Number} selected 子树所有选中节点个数
         */
        getNodeSelectInfo: function (item, selectedHash, index, loadCache) {
            loadCache = loadCache || {};
            index = index || '';
            // 已缓存
            if (loadCache.hasOwnProperty(index)) {
                return loadCache[index];
            }
            var result = {
                total: 0,
                selected: 0
            };
            // 叶子
            if (!(item.children instanceof Array)) {
                result.total = result.selected = selectedHash[item.value] === true ? 1 : 0;
                loadCache[index] = JSON.parse(JSON.stringify(result));
                return result;
            }
            // 树
            for (var i = 0; i < item.children.length; i++) {
                var child = item.children[i];
                var childIndex = index + ',' + i;
                if (!loadCache.hasOwnProperty(childIndex)) {
                    this.getNodeSelectInfo(child, selectedHash, childIndex, loadCache);
                }
                var cache = loadCache[childIndex];
                result.total += cache.total;
                result.selected += cache.selected;
            }
            loadCache[index] = JSON.parse(JSON.stringify(result));
            return result;
        },

        dualTreeSelectorEngine: {
            /**
             * 指针方法，选中子树
             * @interface dualTreeSelectorEngine.select
             * @param {Object} selected Tree的选中hash
             * @param {TreeItemObject} item 节点数据源
             * @example
             * 此处逻辑：
             * （1）如果当前节点是叶子节点，标记为true
             * （2）如果当前节点不是叶子节点，在其树下所有叶子标记为true
             * （3）如果当点节点有children属性，但children长度为0，则将此节点标记为1
             */
            select: function (selected, item) {

                if (!(item.children instanceof Array)) {
                    selected[item.value] = true;
                    return;
                }

                if (item.children.length === 0) {
                    selected[item.value] = 1;
                    return;
                }

                targetChildren(item.children);

                function targetChildren(arr) {
                    if (!(arr instanceof Array)) return;
                    for (var i = 0; i < arr.length; i++) {
                        var child = arr[i];
                        if (child.children instanceof Array) {
                            targetChildren(child.children);
                            continue;
                        }
                        selected[child.value] = true;  
                    }
                }
            },

            /**
             * 指针方法，删除子树
             * @interface dualTreeSelectorEngine.unselect
             * @param {Object} selected Tree的选中hash
             * @param {TreeItemObject} item 节点数据源
             * @example
             * 此处逻辑
             * （1）如果是叶子，则删除
             * （2）如果不是叶子，则删除该子树上的所有叶子
             */
            unselect: function (selected, item) {

                if (!(item.children instanceof Array)) {
                    delete selected[item.value];
                    return;
                }

                delChildren(item.children);

                function delChildren(arr) {
                    if (!(arr instanceof Array)) return;
                    for (var i = 0; i < arr.length; i++) {
                        var child = arr[i];
                        if (child.children instanceof Array) {
                            delChildren(child.children);
                            continue;
                        }
                        delete selected[child.value];  
                    }
                }
            }
        }
    };   
});
