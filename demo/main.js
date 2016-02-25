define(function (require) {

    var ReactDOM = require('react-dom');
    var React = require('react');
    var App = require('demo.jsx');

    render(window.location.hash);

    window.onhashchange = function () {
        render(window.location.hash);
    };

    function render(hash) {
        hash = hash.length === 0 ? '' : hash.substr(1, hash.length);
        var props = parseQuery(hash);
        props.dispatch = appDispatchHandler;
        ReactDOM.render(
            React.createElement(App, props),
            document.getElementById('react-container')
        );
    }

    function appDispatchHandler(type, param) {
        switch (type) {
            case 'changeHash':
                var hash = window.location.hash;
                hash = hash.length === 0 ? '' : hash.substr(1, hash.length);
                var obj = parseQuery(hash);
                for (var key in param) {
                    obj[key] = param[key];
                }
                window.location.hash = stringifyQuery(obj);
                break;
            default:
                break;
        }
    }


    function parseQuery(query) {
        var reg = /([^=&\s]+)[=\s]*([^=&\s]*)/g;
        var obj = {};
        while(reg.exec(query)){
            obj[RegExp.$1] = RegExp.$2;
        }
        return obj;
    }

    function stringifyQuery(obj) {
        var str = '';
        obj = JSON.parse(JSON.stringify(obj));
        for (var key in obj) {
            if (!obj.hasOwnProperty(key)) continue;
            str += (str.length > 0 ? '&' : '') + key + '=' + obj[key];
        }
        return str;
    }

});