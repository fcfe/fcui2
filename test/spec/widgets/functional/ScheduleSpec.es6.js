/**
 * @file Specs for Schedule
 * @author Brian Li (lbxxlht@163.com)
 * @date  07/03/2016
 */

define(function (require) {


    const _ = require('underscore');
    const React = require('react');
    const ReactDOM = require('react-dom');
    const TestUtils = React.addons.TestUtils;
    const Schedule = require('Schedule.jsx');
    const util = require('core/util');

    function realRender(Component, props) {
        return TestUtils.renderIntoDocument(<Component {...props} />);
    }

    describe('Schedule', () => {

        describe('Base Testing', () => {

            it('Normal Schedule', () => {
                let dom = realRender(Schedule, {});
                expect(dom.refs.container.childNodes.length).toBe(4);
            });

            it('mouse move', () => {
                let dom = realRender(Schedule, {value: '[1,1,"",""]'});
                dom.onOptMouseMove({clientX: 10, clientY: 10});
                expect(dom.refs.legendLayer.___layerContainer___.childNodes[0].innerHTML).toBe('1');
                dom.onOptMouseMove({clientX: 50, clientY: 10});
                expect(dom.refs.legendLayer.___layerContainer___.childNodes[0].innerHTML).toBe('2:00 - 4:00');
                dom.onOptMouseMove({clientX: 50, clientY: 80});
                expect(dom.refs.legendLayer.___layerContainer___.childNodes[0].innerHTML).toBe('2:00 - 3:00');
                dom.onOptMouseOut();
                expect(dom.refs.legendLayer.___layerContainer___.childNodes.length).toBe(0);
            });

            it('dragging', () => {
                let dom = realRender(Schedule, {});
                let drapLayer = dom.refs.container.childNodes[0].childNodes[3];
                expect(drapLayer.className).toBe('drag-layer');
                TestUtils.Simulate.mouseDown(drapLayer, {clientX: 40, clientY: 40});
                let evt = document.createEvent('MouseEvents');
                evt.initEvent('mousemove', true, false, undefined, undefined, undefined, undefined, 50, 100);
                window.dispatchEvent(evt);
                evt.initEvent('mouseup', true, false, undefined, undefined, undefined, undefined, 50, 100);
                window.dispatchEvent(evt);
            });

            it('disabled', () => {
                let dom = realRender(Schedule, {disabled: true});
                dom.onOptMouseMove({clientX: 10, clientY: 10});
                expect(dom.refs.legendLayer.___layerContainer___.childNodes.length).toBe(0);
                dom.onOptMouseMove({clientX: 50, clientY: 10});
                expect(dom.refs.legendLayer.___layerContainer___.childNodes.length).toBe(0);
                dom.onOptMouseMove({clientX: 50, clientY: 80});
                expect(dom.refs.legendLayer.___layerContainer___.childNodes.length).toBe(0);
                dom.onOptMouseOut();
                expect(dom.refs.legendLayer.___layerContainer___.childNodes.length).toBe(0);
                let drapLayer = dom.refs.container.childNodes[0].childNodes[3];
                TestUtils.Simulate.mouseDown(drapLayer, {clientX: 40, clientY: 40});
                let evt = document.createEvent('MouseEvents');
                evt.initEvent('mousemove', true, false, undefined, undefined, undefined, undefined, 50, 100);
                window.dispatchEvent(evt);
                evt.initEvent('mouseup', true, false, undefined, undefined, undefined, undefined, 50, 100);
                window.dispatchEvent(evt);
                dom.onDrop(1, 1, {});
            });

            it('selector', () => {
                let dom = realRender(Schedule, {
                    value: '',
                    flags: {enableRowSelector: true, enableColumnSelector: true}
                });
                expect(dom.refs.container.childNodes.length).toBe(5);
                expect(dom.refs.container.childNodes[0].childNodes.length).toBe(24);
                TestUtils.Simulate.change(dom.refs.container.childNodes[0].childNodes[0].childNodes[0], {target: {
                    checked: true
                }});
                TestUtils.Simulate.change(dom.refs.container.childNodes[2].childNodes[1].childNodes[0], {target: {
                    checked: true
                }});
            });

        });

    });
});
