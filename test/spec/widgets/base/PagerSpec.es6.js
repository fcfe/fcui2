/**
 * @file Specs for Pager
 * @author Brian Li (lbxxlht@163.com)
 * @date  07/03/2016
 */

define(function (require) {


    const _ = require('underscore');
    const React = require('react');
    const ReactDOM = require('react-dom');
    const TestUtils = React.addons.TestUtils;
    const Pager = require('Pager.jsx');


    function realRender(Component, props) {
        return TestUtils.renderIntoDocument(<Component {...props} />);
    }

    describe('Pager', () => {

        describe('Base Testing', () => {

            it('Normal Pager', () => {
                let dom = realRender(Pager, {});
                expect(dom.refs.container.className).toBe('fcui2-pager fcui2-pager-normal browser-chrome');
                expect(dom.refs.container.childNodes.length).toBe(12);
            });

            it('value and events', () => {
                let value = '';
                let dom = realRender(Pager, {
                    value: 3,
                    onChange(e) {
                        value = e.target.value;
                    }
                });
                expect(dom.refs.container.childNodes[3].className).toBe('fcui2-button fcui2-button-active browser-chrome');
                TestUtils.Simulate.click(dom.refs.container.childNodes[4]);
                expect(value).toBe(4);
                TestUtils.Simulate.click(dom.refs.container.childNodes[0]);
                expect(value).toBe(2);
                TestUtils.Simulate.click(dom.refs.container.childNodes[11]);
                expect(value).toBe(4);
            });

            it('disabled', () => {
                let value = '';
                let dom = realRender(Pager, {
                    value: 3,
                    disabled: true,
                    onChange(e) {
                        value = e.target.value;
                    }
                });
                TestUtils.Simulate.click(dom.refs.container.childNodes[11]);
                expect(value).toBe('');
            });

            it('large size', () => {
                let dom = realRender(Pager, {
                    min: 1,
                    max: 100,
                    value: 50,
                    threshold: 2
                });
                expect(dom.refs.container.childNodes.length).toBe(11);
            });


        });

    });
});
