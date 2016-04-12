define(function (require) {

    var Tip = require('../../Tip.jsx');
    var React = require('react');

    return React.createClass({
        getDefaultProps: function () {
            return {
                message: '',
                buttonLabel: '',
                colSpan: 1,
                onClick: function () {}
            };
        },
        clickHandler: function (e) {
            this.props.onClick('TableMessageBarClick', {});
        },
        render: function () {
            return (
                <tr className="tr-message">
                    <td colSpan={this.props.colSpan}>
                        <span>{this.props.message}</span>
                        <span onClick={this.clickHandler} className="link">{this.props.buttonLabel}</span>
                    </td>
                </tr>
            );
        }
    });
});
