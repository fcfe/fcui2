define(function (require) {


    var React = require('react');


    function factory (item) {
        var doms = [];
        for (var key in item) {
            if (!item.hasOwnProperty(key)) continue;
            doms.push(
                <div key={key} className="parser-default-item">
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
            return (<div className="parser-default">{factory(this.props.item)}</div>);
        }
    });

});
