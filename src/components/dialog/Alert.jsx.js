/**
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2
 * @test 这就是个测试，看看能不能自定义语法如果能，还用YUI自己的语法干啥？
 */
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
        onClose: function () {
            this.props.close();
        },
        render: function () {
            return (
                <div className="fcui2-dialog-alert">
                    <div className="message">{this.props.message}</div>
                    <div className="button-bar">
                        <Button skin="important" label="确定" onClick={this.onClose}/>
                    </div>
                </div>
            );
        }
    });


});
