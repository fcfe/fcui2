define(function (require) {

    var React = require('react');

    return React.createClass({
        getDefaultProps: function () {
            return {
                conf: {},
                item: {},
                index: -1,
                onAction: function () {}
            };
        },
        clickHandler: function (e) {
            this.props.onAction('ButtonRendererClick', {
                field: this.props.conf.field,
                item: this.props.item,
                index: this.props.index
            });
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
            var btnProp = {
                className: 'font-icon',
                style: {
                    float: tdProp.style.textAlign === 'left' ? 'right' : 'left'
                },
                onClick: this.clickHandler
            };
            if (typeof conf.hasOwnProperty('button')) {
                if (typeof conf.button === 'function') {
                    btnProp.className += ' ' + conf.button(value, item);
                }
                else {
                    btnProp.className += ' ' + conf.button;
                }
            }
            if (typeof conf.content === 'function') {
                value = conf.content(value, item);
            }
            // if (typeof conf.width === 'number') {
            //     tdProp.style.width = conf.width;
            // }
            return (
                <td {...tdProp}>
                    {value}
                    <div {...btnProp}></div>
                </td>
            );
        }
    });
}); 