define(function (require) {


    var React = require('react');
    var classitems = require('../../config').items;
    var Table = require('fcui/Table.jsx');


    var fieldConfig = [
        {
            label: 'Property',
            field: 'name',
            prepare: tdPrepare
        },
        {
            label: 'Type',
            field: 'type',
            prepare: tdPrepare
        },
        {
            label: 'Description',
            field: 'description',
            prepare: tdPrepare
        }
    ];


    function tdPrepare(props, item, row, column, me) {
        props.className += ' level-' + item.level;
        props.style = props.style || {};
        props.style.color = item.isImport ? 'green' : 'black';
    }


    // 导入外部文件的param注释
    function getImportProperties(item) {
        var result = [];
        // 注释块过滤条件
        var filter = item.type.replace('Import|', '').toLowerCase();
        // 目标文件注释块集合
        var items = classitems[item.name];
        // param名称过滤条件
        var description = item.description + ' ';
        if (!filter || !items || description.length === ' ') return result;
        // 扫描所有注释块
        for (var i = 0; i < items.length; i++) {
            var obj = items[i];
            // 过滤
            if (!obj.hasOwnProperty(filter) || !obj.hasOwnProperty('params')) {
                continue;
            }
            // 扫描块内所有param
            for (var j = 0; j < obj.params.length; j++) {
                if (description.indexOf(obj.params[j].name + ' ') > -1) {
                    var copy = JSON.parse(JSON.stringify(obj.params[j]));
                    // 避免循环加载
                    if (copy.type.indexOf('Import|') === 0) continue;
                    copy.isImport = true;
                    result.push(copy);
                }
            }
        }
        return result;
    }


    // 生成表格数据源
    function datasourceFactory(params, prefix) {
        var result = [];
        for (var i = 0; i < params.length; i++) {
            itemFactory(params[i], 1, prefix);
        }
        return result;
        function itemFactory(item, level, prefix) {
            // 处理导入命令
            if (item.type.indexOf('Import|') === 0) {
                var insert = getImportProperties(item);
                for (var i = 0; i < insert.length; i++) {
                    itemFactory(insert[i], level, prefix);
                }
                return;
            }
            // 处理一般类型
            var obj = JSON.parse(JSON.stringify(item));
            delete obj.props;
            obj.name = prefix + '.' + obj.name;
            obj.level = level;
            result.push(obj);
            if (item.hasOwnProperty('props') && item.props.length) {
                for (var i = 0; i < item.props.length; i++) {
                    itemFactory(item.props[i], level + 1, obj.name);
                }
            }
        }
    }


    return React.createClass({
        // @override
        getDefaultProps: function () {
            return {
                params: [],
                prefix: 'this.props'
            };
        },
        render: function () {
            var tableProp = {
                fieldConfig: fieldConfig,
                datasource: datasourceFactory(this.props.params, this.props.prefix),
                flags: {showHeader: true}
            };
            return (<div><Table {...tableProp}/></div>);
        }
    });
});
