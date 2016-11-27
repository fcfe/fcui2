/**
 * @file Specs for Dialog
 * @author Brian Li (lbxxlht@163.com)
 * @date  07/03/2016
 */

define(function (require) {


    const _ = require('underscore');
    const React = require('react');
    const ReactDOM = require('react-dom');
    const TestUtils = React.addons.TestUtils;
    const Dialog = require('Dialog.jsx');
    const Button = require('Button.jsx');

    describe('Dialog', () => {

        describe('Base Testing', () => {

            it('Normal Dialog', () => {
                let dialog = new Dialog();
                dialog.alert({
                    title: 'test alert',
                    message : 'test message'
                });
                expect(dialog.___ui___.state.contentProps.message).toBe('test message');
                dialog.___ui___.resize();
                dialog.___ui___.close();
                expect(dialog.___ui___).toBe(null);
                dialog.pop({
                    content: Button,
                    contentProps: null
                });
                expect(dialog.___ui___ != null).toBe(true);
                dialog.___ui___.close();
                expect(dialog.___ui___).toBe(null);
                dialog.pop({
                    showCloseButton: true,
                    onBeforeClose: new Function()
                });
                expect(dialog.___ui___ != null).toBe(true);
            });

            it('Update Dialog Content', () => {
                let dialog = new Dialog();
                dialog.alert({
                    title: 'test alert',
                    message : 'test message'
                });
                expect(dialog.___ui___.state.contentProps.message).toBe('test message');
                dialog.updatePopContentProps({
                    message: 'new message'
                });
                expect(dialog.___ui___.state.contentProps.message).toBe('new message');
                dialog.updatePopContentProps(false);
                dialog.updatePopContentProps({
                    message: 'new message2',
                    newProp: 'newProp'
                });
                expect(dialog.___ui___.state.contentProps.message).toBe('new message2');
                dialog.___ui___.close();
                dialog.updatePopContentProps(false);
                expect(dialog.___ui___).toBe(null);
            });

            it('Test onClose', () => {
                let dialog = new Dialog();
                let closed = false;
                dialog.alert({
                    title: 'test alert',
                    message : 'test message',
                    onClose() {
                        closed = true;
                    }
                });
                dialog.___ui___.close();
                expect(closed).toBe(true);
                dialog.close();
                dialog.confirm({
                    title: 'test alert',
                    message : 'test message',
                    onClose() {
                        closed = 'confirm';
                    }
                });
                dialog.___ui___.close();
                expect(closed).toBe('confirm');
            });

            it('Test Confirm', () => {
                let dialog = new Dialog();
                let enter = false;
                let cancel = false;
                let closed = false;
                dialog.confirm({
                    title: 'test alert',
                    message : 'test message',
                    onEnter() {
                        enter = true;
                    },
                    onCancel() {
                        cancel = true;
                    },
                    onClose() {
                        closed = true;
                    }
                });
                expect(dialog.___ui___.refs.window.___content___.childNodes[0].childNodes[1].className).toBe('button-bar');
                let buttonBar = dialog.___ui___.refs.window.___content___.childNodes[0].childNodes[1];
                TestUtils.Simulate.click(buttonBar.childNodes[0]);
                expect(enter).toBe(true);
                dialog.confirm({
                    title: 'test alert',
                    message : 'test message',
                    onEnter() {
                        enter = true;
                    },
                    onCancel() {
                        cancel = true;
                    },
                    onClose() {
                        closed = true;
                    }
                });
                buttonBar = dialog.___ui___.refs.window.___content___.childNodes[0].childNodes[1];
                TestUtils.Simulate.click(buttonBar.childNodes[1]);
                expect(cancel).toBe(true);
                dialog.confirm();
                expect(dialog.___ui___ != null).toBe(true);
                dialog.alert();
                expect(dialog.___ui___ != null).toBe(true);
                dialog.alert();
                buttonBar = dialog.___ui___.refs.window.___content___.childNodes[0].childNodes[1];
                TestUtils.Simulate.click(buttonBar.childNodes[0]);
                expect(dialog.___ui___).toBe(null);
            });
        });

    });
});
