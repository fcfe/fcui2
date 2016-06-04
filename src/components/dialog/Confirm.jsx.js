/**
 *  Confirm窗体内容
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2
 */
define(function (require) {


    var Button = require('../../Button.jsx');
    var React = require('react');


    return React.createClass({
        getDefaultProps : function () {
            return {
                message: 'Message',
                onEnter: function () {},
                onCancel: function () {}
            };
        },
        onEnterClick: function () {
            this.props.onEnter();
            this.props.close();
        },
        onCancelClick: function () {
            this.props.onCancel();
            this.props.close();
        },
        render: function () {
            return (
                <div className="fcui2-dialog-alert">
                    <div className="message">{this.props.message}</div> 
                    <div className="button-bar">
                        <Button skin="important" label="确定" onClick={this.onEnterClick}/>
                        <Button label="取消" onClick={this.onCancelClick}/>
                    </div>
                </div>
            );
        }
    });


});
