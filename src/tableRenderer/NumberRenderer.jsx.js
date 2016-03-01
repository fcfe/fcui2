define(function (require) {

    var React = require('react');

    return React.createClass({
        render: function () {
            var item = this.props.item;
            var conf = this.props.conf;
            var value = item[conf.field];
            var tdProp = {
                className: 'td-number',
                style: {
                    textAlign: conf.align || 'right',
                    color: this.props.color || '#000'                    
                }
            };
            if (typeof conf.content === 'function') {
                value = conf.content(value, item);
            }
            switch (conf.renderType) {
                case 'int':
                    value = parseInt(value, 10);
                    break;
                case 'float':
                    value = value.toFixed(conf.fixed || 2);
                    break;
                case 'percent':
                    value = (value * 100).toFixed(2) + '%';
                    break;
            }
            return (<td {...tdProp}>{value}</td>);
        }
    });

}); 