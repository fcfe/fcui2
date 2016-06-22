define(function (require) {


    var React = require('react');
    var DefaultParser = require('./Default.jsx');
    var items = require('../config').items;
    var router = require('./router');
    

    function getParser(item) {
        for (var i = 0; i < router.length; i++) {
            if (router[i].validation(item)) return router[i].parser;
        }
        return DefaultParser;
    }


    function itemFactory(file) {
        if (!items[file] || !items[file].length) return null; 
        var doms = [];
        for (var i = 0; i < items[file].length; i++) {
            var item = items[file][i];
            var Parser = getParser(item);
            if (!Parser) continue;
            doms.push(<Parser key={'item' + i} item={item} />);
        }
        return doms;
    }


    return React.createClass({
        // @override
        getDefaultProps: function () {
            return {
                file: 'src\\Button.jsx.js',
            };
        },
        render: function () {
            var file = this.props.file || '';
            file = file.replace(/_/g, '\\');
            if (!items.hasOwnProperty(file) || items[file].length === 0) return <div></div>;
            return (<div>{itemFactory(file)}</div>);
        }
    });

});
