define(function (require) {

    var util = require('../core/util');
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
            this.props.onAction('OptRendererClick', {
                field: this.props.conf.field,
                item: this.props.item,
                index: this.props.index
            });
        },
        mouseOverHandler: function (e) {
            var layer = this.refs.layer;
            var container = this.refs.container;
            var pos = util.getDOMPosition(container);
            container.className = pos.x + layer.offsetWidth > document.body.offsetWidth
                ? 'icon-container pos-left' : 'icon-container pos-right';
        },
        render: function () {
            var item = this.props.item;
            var conf = this.props.conf;
            var tdProp = {
                className: 'td-optsug',
                ref: 'rootContainer',
                style: {}
            };
            var iconProp = {
                className: 'font-icon font-icon-exclamation-circle',
                style: {
                    color: '#000'
                }
            };
            if (conf.hasOwnProperty('color')) {
                iconProp.style.color = typeof conf.color === 'function' ? conf.color(item) : conf.color + '';
            }
            if (typeof conf.width === 'number') {
                tdProp.style.width = conf.width;
            }
            var message = typeof conf.content === 'function' ? conf.content(item) : conf.content + '';
            var buttonLabel = typeof conf.buttonLabel === 'function' ? conf.buttonLabel(item) : conf.buttonLabel + '';
            return (
                <td {...tdProp}>
                    <div className="icon-container pos-left" ref="container" onMouseOver={this.mouseOverHandler}>
                        <div className="info-layer" ref="layer">
                            <div {...iconProp}></div>
                            <span className="info-text">{message}</span>
                            <span className="info-link" onClick={this.clickHandler}>{buttonLabel}</span>
                        </div>
                        <div {...iconProp} data-ui-ctrl="top-icon"></div>
                    </div>
                </td>
            );
        }
    });
}); 