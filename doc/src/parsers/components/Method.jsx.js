define(function (require) {


    var React = require('react');
    var Params = require('./Params.jsx');


    function getMethodName(item) {
        var result = '';
        result += item.name + '(';
        if (item.hasOwnProperty('params') && item.params.length) {
            var params = [];
            for (var i = 0; i < item.params.length; i++) params.push(item.params[i].name);
            result += params.join(', ');
        }
        result += ')';
        if (item.hasOwnProperty('return')) {
            var returnObj = item['return'];
            result = '{' + returnObj.type + '} ' + result;
        }
        return result;
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
            var description = item.description;
            if (item.hasOwnProperty('return')) {
                var returnObj = item['return'];
                description += ', 返回:' + returnObj.description;
            }
            return (
                <div className="method-container">
                    <h4>{getMethodName(item)}</h4>
                    <h6>
                        {description}
                        {
                            item.attention && item.attention.length
                            ? <span style={{color: 'red', float: 'right'}}>{item.attention}</span> : null
                        }
                    </h6>
                    {item.params && item.params.length ? <Params params={item.params} prefix=""/> : null}
                </div>
            );
        }
    });
});
