define(function (require) {
    var React = require('react');
    return React.createClass({
        getInitialState: function () {
            return {};
        },
        render: function () {
            var item = this.props.item;
            var conf = this.props.conf;
            var value = item[conf.field];
            var tdProp = {
                className: 'td-button',
                style: {
                    textAlign: conf.align || 'left',
                    color: this.props.color || '#000'
                }
            };
            if (typeof conf.content === 'function') {
                value = conf.content(value, item);
            }
            // if (typeof conf.width === 'number') {
            //     tdProp.style.width = conf.width;
            // }
            return (
                <td {...tdProp}>
                    {value}
                </td>
            );
        }
    });
});
