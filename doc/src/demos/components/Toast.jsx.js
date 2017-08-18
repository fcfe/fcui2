/**
 * @file 弹出层，下拉层demo
 * @author Han Bing Feng
 */

define(function (require) {


    let React = require('react');
    let Button = require('fcui2/Button.jsx');
    const Toast = require('fcui2/Toast.jsx');


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
        render() {
            return (
                <div>
                    <Button label="pop success" onClick={this.popSuccess}/><br/><br/>
                    <Button label="pop error" onClick={this.popFail}/>
                </div>
            );
        }
    });


});
