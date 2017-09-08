/**
 * @file Specs for DropDownCalendar
 * @author Brian Li (lbxxlht@163.com)
 * @date  07/03/2016
 */

define(function (require) {


    const _ = require('underscore');
    const React = require('react');
    const ReactDOM = require('react-dom');
    const TestUtils = React.addons.TestUtils;
    const DropDownCalendar = require('DropDownCalendar.jsx');


    function realRender(Component, props) {
        return TestUtils.renderIntoDocument(<Component {...props} />);
    }

    describe('DropDownCalendar', () => {

        describe('Base Testing', () => {

            it('Normal DropDownCalendar', () => {
                let dom = realRender(DropDownCalendar, {});
                expect(dom.refs.container.childNodes.length).toBe(3);
            });

            it('Events', () => {
                let value = '';
                let dom = realRender(DropDownCalendar, {
                    value: '1999-01-31',
                    onChange(e) {
                        value = e.target.value;
                    }
                });
                TestUtils.Simulate.mouseEnter(dom.refs.container);
                expect(dom.state.layerOpen).toBe(true);
                let layer = dom.refs.layer.___renderContainer___.childNodes[0];
                expect(layer.childNodes.length).toBe(3);
                TestUtils.Simulate.click(layer.childNodes[2].childNodes[34]);
                expect(value).toBe('');
                TestUtils.Simulate.click(layer.childNodes[2].childNodes[10]);
                expect(value).toBe('1999-01-07');
                TestUtils.Simulate.mouseLeave(dom.refs.container);
                expect(dom.state.mouseenter).toBe(false);
            });

        });

    });
});
