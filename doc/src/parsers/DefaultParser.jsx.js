define(function (require) {


    var React = require('react');


    function factory (item) {
        var doms = [];
        for (var key in item) {
            if (!item.hasOwnProperty(key) || key === 'file' || key === 'line' || !item[key].length) continue;
            doms.push(
                <div key={key} className="default-parser-item">
                    <div>{key}</div>
                    <div>{JSON.stringify(item[key])}</div>
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
            return (<div className="default-parser">{factory(this.props.item)}</div>);
        }
    });

});
