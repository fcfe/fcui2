define(function (require) {


    var React = require('react');
    var Params = require('./Params.jsx');
    var classitems = require('../../config').items;
    

    function getWidgetName(file) {
        var arr = file.split('\\');
        file = arr.pop();
        return file.replace(/\.jsx|.js/g, '').toLowerCase();
    }


    function getCallbackNames(params) {
        var result = [];
        if (!(params instanceof Array)) return result;
        for (var i = 0; i < params.length; i++) {
            if (params[i].type.toLowerCase() === 'function') result.push(params[i].name);
        }
        return result;
    }


    // 把同一个callback的不同来源的param合并到一起
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


    // 根据标记，扫描相关文件，把所有callback的param抓出来
    function getCallbackParams(file, callbacks) {
        var widget = getWidgetName(file);
        // 获取扫描的文件名
        var files = [file];
        for (var key in classitems) {
            if (
                key.indexOf('src\\components\\' + widget + '\\') === 0
                || key.indexOf('src\\mixins\\') === 0
            ) {
                files.push(key);
            }
        }
        // 制作数据集
        var result = {};
        for (var i = 0; i < callbacks.length; i++) {
            result[callbacks[i]] = [];
        }
        // 扫描文件
        for (var j = 0; j < files.length; j++) {
            var classes = classitems[files[j]];
            for (var k = 0; k < classes.length; k++) {
                var item = classes[k];
                if (!item.hasOwnProperty('fire') || !(item.params instanceof Array) || !item.params.length) continue;
                var tmp = (item.fire + '').split(' ');
                if (tmp[0].toLowerCase() !== widget || !result.hasOwnProperty(tmp[1])) continue;
                mergeParams(result[tmp[1]], item.params);
            }
        }
        return result;
    }


    function domFactory(callbacks, params) {
        var doms = [];
        for (var i = 0; i < callbacks.length; i++) {
            var param = params[callbacks[i]];
            if (param.length === 0) continue;
            var label = 'this.props.' + callbacks[i] + '(';
            for (var j = 0; j < param.length; j++) {
                label += 'param' + (j + 1) + (j < param.length - 1 ? ', ' : ''); 
            }
            label += ')';
            doms.push(
                <div key={i} style={{marginTop: 5}}>
                    <h3>{label}</h3>
                    <Params params={param} prefix=''/>
                </div>
            );
        }
        return doms;
    }


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


});
