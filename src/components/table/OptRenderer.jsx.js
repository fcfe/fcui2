/**
 * @file 黄色layer td
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2
 */
define(function (require) {

    var util = require('../../core/util');
    var React = require('react');

    return React.createClass({
        getDefaultProps: function () {
            return {
                className: '',
                buttonDisplay: true,
                buttonLabel: '',
                content: '',
                style: {},
                item: {},
                row: -1,
                column: -1,
                onAction: function () {}
            };
        },
        onButtonClick: function (e) {
            this.props.onAction('OptRendererClick', {
                item: this.props.item,
                row: this.props.row,
                column: this.props.column
            });
        },
        onMouseOver: function (e) {
            var layer = this.refs.layer;
            var container = this.refs.container;
            var pos = util.getDOMPosition(container);
            container.className = pos.x + layer.offsetWidth > document.body.offsetWidth
                ? 'icon-container pos-left' : 'icon-container pos-right';
        },
        render: function () {
            var message = this.props.content;
            if (!message) {
                return <td></td>;
            }
            var buttonLabel = this.props.buttonLabel;
            var buttonDisplay = this.props.hasOwnProperty('buttonDisplay') ? this.props.buttonDisplay : true;
            var tdProp = {
                className: 'td-optsug ' + this.props.className,
                style: this.props.style
            };
            var buttonProp = {
                className: 'info-link',
                style: buttonDisplay ? undefined : {display: 'none'},
                onClick: this.onButtonClick
            };
            return (
                <td {...tdProp}>
                    <div className="icon-container" ref="container" onMouseOver={this.onMouseOver}>
                        <div className="info-layer" ref="layer">
                            <div className="font-icon font-icon-exclamation-circle"></div>
                            <span className="info-text">{message}</span>
                            <span {...buttonProp}>{buttonLabel}</span>
                        </div>
                        <div className="icon-box font-icon font-icon-exclamation-circle"></div>
                    </div>
                </td>
            );
        }
    });
});
