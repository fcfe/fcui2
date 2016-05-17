/**
 * @file 黄色layer td
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.1
 */
define(function (require) {

    var util = require('../../core/util');
    var React = require('react');

    return React.createClass({
        getDefaultProps: function () {
            return {
                className: '',
                style: {},
                item: {},
                row: -1,
                column: -1,
                onAction: function () {}
            };
        },
        clickHandler: function (e) {
            this.props.onAction('OptRendererClick', {
                item: this.props.item,
                row: this.props.row,
                column: this.props.column
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
            var message = this.props.content;
            var buttonLabel = this.props.buttonLabel;
            var buttonDisplay = this.props.hasOwnProperty('buttonDisplay') ? this.props.buttonDisplay : true;
            if (!message) {
                return <td></td>;
            }
            var tdProp = {
                className: 'td-optsug ' + this.props.className,
                ref: 'rootContainer',
                style: this.props.style
            };
            var iconProp = {
                className: 'font-icon font-icon-exclamation-circle'
            };
            var buttonProp = {
                className: 'info-link',
                onClick: this.clickHandler
            };
            if (!buttonDisplay) {
                buttonProp.style = {display: 'none'};
            }
            return (
                <td {...tdProp}>
                    <div className="icon-container pos-left" ref="container" onMouseOver={this.mouseOverHandler}>
                        <div className="info-layer" ref="layer">
                            <div {...iconProp}></div>
                            <span className="info-text">{message}</span>
                            <span {...buttonProp}>{buttonLabel}</span>
                        </div>
                        <div {...iconProp} data-ui-ctrl="top-icon"></div>
                    </div>
                </td>
            );
        }
    });
});
