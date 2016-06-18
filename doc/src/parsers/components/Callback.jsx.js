define(function (require) {


    var React = require('react');
    var Params = require('./Params.jsx');
    var classitems = require('../../config').items;
    
    return React.createClass({
        // @override
        getDefaultProps: function () {
            return {
                item: {}
            };
        },
        render: function () {
            var item = this.props.item;
            var callbacks = getCallbackNames(item.params);
            if (callbacks.length === 0) return null;
            var callbackParams = getCallbackParams(item.file, callbacks);
            return (<div>{domFactory(callbacks, callbackParams)}</div>);
        }
    });


    function getWidgetName(file) {
        var arr = file.split('\\');
        file = arr.pop();
        return file.replace(/\.jsx|.js|-test/g, '').toLowerCase();
    }


    function getCallbackNames(params) {
        var result = [];
        if (!(params instanceof Array)) return result;
        for (var i = 0; i < params.length; i++) {
            var param = params[i];
            if (param.type.toLowerCase() === 'function') {
                result.push(params[i].name);
                continue;
            }
            if (param.type.indexOf('Import') !== 0) continue;
            getImportProperties(param);
        }
        return result;
        function getImportProperties(item) {
            // 注释块过滤条件
            var filter = item.type.replace('Import|', '').toLowerCase();
            // 目标文件注释块集合
            var items = classitems[item.name];
            // param名称过滤条件
            var description = item.description + ' ';
            if (!filter || !items || description === ' ') return;
            // 扫描所有注释块
            for (var i = 0; i < items.length; i++) {
                var obj = items[i];
                // 过滤
                if (!obj.hasOwnProperty(filter) || !obj.hasOwnProperty('params')) continue;
                // 扫描块内所有param
                for (var j = 0; j < obj.params.length; j++) {
                    if (
                        description.indexOf(obj.params[j].name + ' ') > -1
                        && obj.params[j].type.toLowerCase() === 'function'
                    ) {
                        result.push(obj.params[j].name);
                    }
                }
            }
        }
    }

    // 根据标记，扫描相关文件，把所有callback的param抓出来
    function getCallbackParams(file, callbacks) {

        var widget = getWidgetName(file);
        // 获取待扫描文件
        var files = [file];
        for (var key in classitems) {
            if (key.indexOf('src\\components\\' + widget + '\\') === 0) files.push(key);
        }
        // 制作数据集
        var result = {};
        for (var i = 0; i < callbacks.length; i++) result[callbacks[i]] = [];
        // 依次扫描文件
        files.map(scanFile);
        return result;

        function scanFile(file) {
            var classes = classitems[file];
            for (var i = 0; i < classes.length; i++) {
                var item = classes[i];
                if (!item.hasOwnProperty('fire')) continue;
                var arr = (item.fire + '').split(' ');
                if (arr[0] === 'Import') {
                    loadImport(arr);
                    continue;
                }
                if (
                    arr[0].toLowerCase() !== widget || !result.hasOwnProperty(arr[1])
                    || !(item.params instanceof Array) || !item.params.length
                ) {
                    continue;
                }
                mergeParams(result[arr[1]], item.params);
                if (item['return']) result[arr[1]]['returnValue'] = item['return'];
            }
        }

        function loadImport(arr) {
            arr.shift();
            var fileName = arr.shift();
            var fireDescription = arr.join(' ');
            arr.shift();
            var fireName = arr.shift();
            if (!classitems[fileName]) return;
            for (var i = 0; i < classitems[fileName].length; i++) {
                var item = classitems[fileName][i];
                if (!item.hasOwnProperty('fire') || item.fire !== fireDescription) continue;
                if (item['return']) result['return'] = item['return'];
                result[fireName] = result[fireName] || [];
                result[fireName] = mergeParams(result[fireName], item.params);
                if (item['return']) result[fireName]['returnValue'] = item['return'];
            }
        }
    }


    // 把某个callback的不同来源的param合并到一起
    function mergeParams(result, params) {

        for (var i = 0; i < params.length; i++) {
            if (i > result.length - 1) {
                var param = JSON.parse(JSON.stringify(params[i]));
                param.name = 'param' + (i + 1);
                result.push(param);
                continue;
            }
            else {
                result[i] = mergeItem(params[i], result[i]);
            }
        }
        return result;

        function mergeItem(from, to) {
            to = JSON.parse(JSON.stringify(to));
            // 合并description
            if (to.description.indexOf(from.description) < 0) {
                to.description += '\n' + from.description;
            }
            // 合并type
            if (from.type !== to.type) {
                to.type += '\n' + from.type;
                return to;
            }
            // 类型相同，合并子props
            if (!(from.props instanceof Array)) return to;
            to.props = mergeProp(from.props, to.props);
            return to;
        }

        function mergeProp(from, to) {
            to = to || [];
            to = JSON.parse(JSON.stringify(to));
            var toHash = {};
            // 制作一级属性名称hash
            for (var i = 0; i < to.length; i++) {
                toHash[to[i].name] = to[i];
            }
            for (var j = 0; j < from.length; j++) {
                var prop = from[j];
                // 该属性之前不存在
                if (!toHash.hasOwnProperty(prop.name)) {
                    to.push(JSON.parse(JSON.stringify(prop)));
                    toHash[prop.name] = to[to.length - 1];
                }
                // 该属性之前存在，合并下一层
                else if (prop.props instanceof Array && prop.props.length) {
                    toHash[prop.name].props = mergeProp(prop.props, toHash[prop.name].props);
                }
            }
            return to;
        }
    }


    function domFactory(callbacks, params) {
        var doms = [];
        for (var i = 0; i < callbacks.length; i++) {
            var param = params[callbacks[i]];
            var label = 'this.props.' + callbacks[i] + '(';
            for (var j = 0; j < param.length; j++) label += 'param' + (j + 1) + (j < param.length - 1 ? ', ' : ''); 
            label += ')';
            if (param.returnValue) {
                label = '{' + param.returnValue.type + '} ' + label;
            }
            doms.push(
                <div key={i} style={{marginTop: 5}}>
                    <h3>{label}</h3>
                    {param.returnValue ? <h6>{param.returnValue.description}</h6> : ''}
                    {param.length ? <Params params={param} prefix=''/> : null}
                </div>
            );
        }
        return doms;
    }

});
