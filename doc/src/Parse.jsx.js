define(function (require) {


    var React = require('react');
    var items = require('./config').items;
    var warning = require('./config').warnings;
    var DefaultParser = require('./parsers/Default.jsx');
    var parsers = require('./parsers');
    

    function getParser(item) {
        for (var i = 0; i < parsers.length; i++) {
            if (parsers[i].validation(item)) return parsers[i].parser;
        }
        return DefaultParser;
    }


    function itemFactory(file) {
        if (!items[file] || !items[file].length) return null; 
        var doms = [];
        for (var i = 0; i < items[file].length; i++) {
            var item = items[file][i];
            var Parser = getParser(item);
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
            var file = this.props.file;
            if (
                (!items.hasOwnProperty(file) || items[file].length === 0)
                && (!warning.hasOwnProperty(file) || warning[file].length === 0)
            ) {
                return 'no data';
            }
            return (<div>{itemFactory(this.props.file)}</div>);
        }
    });

});
