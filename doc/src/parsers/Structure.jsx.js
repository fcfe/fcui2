define(function (require) {

    var React = require('react');
    var Code = require('./components/Code.jsx');
    var Params = require('./components/Params.jsx');
    var classitems = require('../config').items;


    function getStructure(tmp, url, structureName) {
        if (!classitems[url] || typeof structureName !== 'string' || !structureName.length) return null;
        var file = classitems[url];
        for (var i = 0; i < file.length; i++) {
            var item = file[i];
            if (item.hasOwnProperty('structure') && item.structure === structureName) return item;
        }
        return null;
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
            if (item.structure.indexOf('Import') === 0) {
                item = getStructure.apply(null, item.structure.split(' '));
            }
            item = !item ? this.props.item : item;
            var prefix = item.structure.replace(/(\w)/, function (v) {return v.toLowerCase();});
            return (
                <div className="parser-structure">
                    <h3>{'<' + item.structure + '>'}</h3>
                    {
                        item.hasOwnProperty('example') && item.example.length > 0
                        ? <Code codes={item.example}/> : null
                    }
                    {
                        item.hasOwnProperty('params') && item.params.length > 0
                        ? <Params params={item.params} prefix={prefix}/> : null
                    }
                </div>
            );
        }
    });
});
