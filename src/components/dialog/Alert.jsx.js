define(function (require) {


    var Button = require('../../Button.jsx');
    var React = require('react');


    return React.createClass({
        getDefaultProps : function () {
            return {
                message: 'Message',
                close: function () {}
            };
        },
        closeHandler: function () {
            this.props.close();
        },
        render: function () {
            return (
                <div className="fcui2-dialog-alert">
                    <div className="message">{this.props.message}</div>
                    <div className="button-bar">
                        <Button skin="important" label="确定" onClick={this.closeHandler}/>
                    </div>
                </div>
            );
        }
    });


});
