/**
 * @file 弹出层，下拉层demo
 * @author Han Bing Feng
 */

define(function (require) {


    const React = require('react');
    const Button = require('fcui2/Button.jsx');
    const Toast = require('fcui2/Toast.jsx');
    const Message = require('fcui2/Message.jsx');

    return React.createClass({
        popSuccess() {
            Toast.pop({
                type: 'success',
                message: 'It is OK!'
            });
        },
        popFail() {
            Toast.pop({
                type: 'error',
                message: 'It is NOT OK!'
            });
        },
        popMessage() {
            Toast.pop({
                skin: 'oneux4',
                autoHideTime: 0,
                subComponent: Message,
                subComponentCloseHandlerName: 'onIconClick',
                subComponentProps: {
                    skin: 'white',
                    message: '提示文案',
                    icon: 'fcui2-icon fcui2-icon-remove',
                    status: 'new-refresh',
                    onRefreshClick() {
                        alert('hello world');
                    },
                    buttonProps: {
                        label: '操作'
                    }
                }
            });
        },
        popMulti() {
            Toast.pop({
                skin: 'oneux4',
                autoHideTime: 0,
                subComponent: Message,
                subComponentCloseHandlerName: 'onIconClick',
                subComponentProps: {
                    skin: 'red',
                    style: {
                        width: 400
                    },
                    message: [
                        '<div class="fcui2-message-multi-lines">',
                        '<div class="message-title">',
                        '<span class="fcui2-icon fcui2-icon-failed-2" style="color:#FF5b5b;font-weight:700;"></span>',
                        '这是标题啊',
                        '</div>',
                        '<div class="message-content">',
                        '这是一堆非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常长的内容',
                        '</div>',
                        '</div>'
                    ].join(''),
                    icon: 'fcui2-icon fcui2-icon-remove'
                }
            });
        },
        render() {
            return (
                <div>
                    <Button label="pop success" onClick={this.popSuccess}/><br/><br/>
                    <Button label="pop error" onClick={this.popFail}/><br/><br/>
                    <Button label="pop message" onClick={this.popMessage}/><br/><br/>
                    <Button label="pop multi lines" onClick={this.popMulti}/>
                </div>
            );
        }
    });


});
