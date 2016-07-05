/**
 * @file Specs for Slider
 * @author Brian Li (lbxxlht@163.com)
 * @date  07/03/2016
 */

define(function (require) {


    const _ = require('underscore');
    const React = require('react');
    const ReactDOM = require('react-dom');
    const TestUtils = React.addons.TestUtils;
    const Slider = require('Slider.jsx');


    function realRender(Component, props) {
        props = props || {};
        return TestUtils.renderIntoDocument(<Component {...props} />);
    }

    describe('Slider', () => {

        describe('Base Testing', () => {

            it('Normal Slider', () => {
                let dom = realRender(Slider, {
                    width: 200,
                    value: 100
                });
                expect(dom.refs.container.childNodes.length).toBe(7);
            });

            it('Normal Slider', () => {
                let value = -1;
                let dom = realRender(Slider, {
                    width: 200,
                    value: 100,
                    onChange(e) {
                        value = e.target.value * 1;
                    }
                });
                expect(dom.refs.container.childNodes.length).toBe(7);
                TestUtils.Simulate.mouseDown(dom.refs.container.childNodes[6]);
                dom.onDrag(-100, 2);
                dom.onDrop(0, 2);

            });
        });

    });
});
