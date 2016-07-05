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
                dialog.___ui___.close();
                expect(dialog.___ui___).toBe(null);
                dialog.updatePopContentProps();
                dialog.updatePopContentProps({
                    message: 'new message',
                    newProp: 'newProp'
                });
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
                let close = false;
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
                dialog.___ui___.close();
                expect(closed).toBe(false);
            });
        });

    });
});
