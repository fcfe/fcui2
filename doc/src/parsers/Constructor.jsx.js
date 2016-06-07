define(function (require) {


    var React = require('react');
    var Params = require('./components/Params.jsx');
    var Method = require('./components/Method.jsx');
    var classitems = require('../config').items;


    function methodFactory(file, className) {
        var doms = [];
        if (!classitems.hasOwnProperty(file)) return null;
        var file = classitems[file];
        for (var i = 0; i < file.length; i++) {
            var item = JSON.parse(JSON.stringify(file[i]));
            if (!item.hasOwnProperty('name') || !item.hasOwnProperty('classname') || item.classname !== className) {
                continue;
            }
            item.name = className + '.' + item.name;
            doms.push(<Method item={item} key={i}/>);
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
            return (
                <div className="parser-constructor">
                    <h3>{'Class ' + item.name + ' ' + item.description}</h3>
                    <Method item={item}/>
                    {methodFactory(item.file, item.name)}
                </div>
            );
        }
    });
});
