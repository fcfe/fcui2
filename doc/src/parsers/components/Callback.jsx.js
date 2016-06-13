define(function (require) {


    var React = require('react');
    var classitems = require('../../config').items;
    var Table = require('fcui/Table.jsx');


    function getWidgetName(file) {
        var arr = file.split('\\');
        file = arr.pop();
        return file.replace(/\.jsx|.js/g, '').toLowerCase();
    }


    function getCallbackNames(params) {
        var result = [];
        if (!(params instanceof Array)) return result;
        for (var i = 0; i < params.length; i++) {
            if (params[i].type.toLowerCase() === 'function') {
                result.push(params[i].name);
            }
        }
        return result;
    }


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
        // 扫描文件，制作数据集
        var result = {};
        for (var i = 0; i < callbacks.length; i++) {
            result[callbacks[i]] = {items: []};
        }
        for (var j = 0; j < files.length; j++) {
            var classes = classitems[files[j]];
            for (var k = 0; k < classes.length; k++) {
                var item = classes[k];
                if (!item.hasOwnProperty('fire') || !(item.params instanceof Array)) continue;
                var tmp = (item.fire + '').split(' ');
                if (tmp[0].toLowerCase() !== widget || !result.hasOwnProperty(tmp[1])) continue;
                result[tmp[1]].items.push(item.params);
            }
        }
        console.log(result);
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
            return (
                <div>
                    {callbacks.join(' ')}
                </div>
            );
        }
    });
});
