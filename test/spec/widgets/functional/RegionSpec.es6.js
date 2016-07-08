/**
 * @file Specs for Region
 * @author Brian Li (lbxxlht@163.com)
 * @date  07/03/2016
 */

define(function (require) {


    const _ = require('underscore');
    const React = require('react');
    const ReactDOM = require('react-dom');
    const TestUtils = React.addons.TestUtils;
    const Region = require('Region.jsx');


    function realRender(Component, props) {
        return TestUtils.renderIntoDocument(<Component {...props} />);
    }

    describe('Region', () => {

        describe('Base Testing', () => {

            it('Normal Region', () => {
                let dom = realRender(Region, {});
                expect(dom.refs.container.childNodes.length).toBe(11);
                // expect(dom.refs.container.childNodes.length).toBe(7);
                // TestUtils.Simulate.mouseDown(dom.refs.container.childNodes[6]);
                // TestUtils.Simulate.click(dom.refs.container, {clientX: 9});
                // dom.onDrop(0, 2);
            });

            it('events', () => {
                let value = '';
                let dom = realRender(Region, {
                    onChange(e) {
                        value = e.target.value;
                    }
                });
                TestUtils.Simulate.click(
                    dom.refs.container.childNodes[1].childNodes[1].childNodes[0]
                        .childNodes[0].childNodes[1]
                );
                expect(value).toBe('1');
                TestUtils.Simulate.click(
                    dom.refs.container.childNodes[1].childNodes[1].childNodes[0]
                        .childNodes[0].childNodes[1]
                );
                expect(value).toBe('');
            });

            it('disabled', () => {
                let value = '';
                let dom = realRender(Region, {
                    disabled: true,
                    onChange(e) {
                        value = e.target.value;
                    }
                });
                TestUtils.Simulate.click(
                    dom.refs.container.childNodes[1].childNodes[1].childNodes[0]
                        .childNodes[0].childNodes[1]
                );
                expect(value).toBe('');
                dom.onRegionChange();
            });

            it('type = single', () => {
                let value = '';
                let dom = realRender(Region, {
                    type: 'single',
                    onChange(e) {
                        value = e.target.value;
                    }
                });
                TestUtils.Simulate.click(
                    dom.refs.container.childNodes[1].childNodes[1].childNodes[0]
                        .childNodes[0].childNodes[2]
                );
                expect(value).toBe('1');
                TestUtils.Simulate.click(
                    dom.refs.container.childNodes[1].childNodes[1].childNodes[1]
                        .childNodes[0].childNodes[2]
                );
                expect(value).toBe('3');
            });

        });

    });
});
