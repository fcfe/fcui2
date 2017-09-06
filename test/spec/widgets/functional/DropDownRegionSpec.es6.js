/**
 * @file Specs for DropDownRegion
 * @author Brian Li (lbxxlht@163.com)
 * @date  07/03/2016
 */

define(function (require) {

    const _ = require('underscore');
    const React = require('react');
    const ReactDOM = require('react-dom');
    const TestUtils = React.addons.TestUtils;
    const DropDownRegion = require('DropDownRegion.jsx');

    function realRender(Component, props) {
        return TestUtils.renderIntoDocument(<Component {...props} />);
    }

    describe('DropDownRegion', () => {

        describe('Base Testing', () => {

            it('Normal DropDownRegion', () => {
                let dom = realRender(DropDownRegion, {});
                ReactDOM.render(
                    React.createElement(DropDownRegion, {
                        value: '1',
                        type: 'single',
                        openLayerType: 'onMouseUp'
                    }),
                    dom.refs.container.parentNode
                );
                expect(dom.refs.container.childNodes.length).toBe(3);
                TestUtils.Simulate.mouseUp(dom.refs.container);
                expect(dom.state.layerOpen).toBe(true);
                ReactDOM.unmountComponentAtNode(dom.refs.container.parentNode);
            });

            it('Events', () => {
                let dom = realRender(DropDownRegion, {
                    value: '1',
                    type: 'single'
                });
                TestUtils.Simulate.mouseEnter(dom.refs.container);
                expect(dom.state.layerOpen).toBe(true);
                let layer = dom.refs.layer.___renderContainer___.childNodes[0];
                expect(layer.childNodes.length).toBe(1);
                let beijingCheckbox = layer.childNodes[0].childNodes[1]
                    .childNodes[1].childNodes[0].childNodes[0].childNodes[0];
                expect(beijingCheckbox.checked).toBe(true);
                TestUtils.Simulate.click(beijingCheckbox);
                TestUtils.Simulate.mouseLeave(dom.refs.container);
                expect(dom.state.mouseenter).toBe(false);
            });

            it('Close by Body Click', () => {
                let dom = realRender(DropDownRegion, {
                    value: '1'
                });
                TestUtils.Simulate.click(dom.refs.container);
                expect(dom.state.layerOpen).toBe(true);
                let evt = document.createEvent('MouseEvents');
                evt.initEvent('click', true, false);
                document.body.dispatchEvent(evt);
                expect(dom.state.layerOpen).toBe(false);
            });

            it('Close by Body Click', () => {
                let dom = realRender(DropDownRegion, {
                    value: '1'
                });
                TestUtils.Simulate.click(dom.refs.container);
                expect(dom.state.layerOpen).toBe(true);
                let evt = document.createEvent('MouseEvents');
                evt.initEvent('click', true, false);
                document.body.dispatchEvent(evt);
                expect(dom.state.layerOpen).toBe(false);
            });

            it('Mouse Leave Layer', () => {
                let dom = realRender(DropDownRegion, {
                    value: '1',
                    type: 'single'
                });
                TestUtils.Simulate.mouseEnter(dom.refs.container);
                expect(dom.state.layerOpen).toBe(true);
                let layer = dom.refs.layer.___layerContainer___;
                let evt = document.createEvent('MouseEvents');
                evt.initEvent('mouseleave', true, false);
                layer.dispatchEvent(evt);
                dom.close();
            });

            it('Cancel Click', () => {
                let dom = realRender(DropDownRegion, {
                    value: '1'
                });
                TestUtils.Simulate.click(dom.refs.container);
                expect(dom.state.layerOpen).toBe(true);
                let layer = dom.refs.layer.___renderContainer___.childNodes[0];
                expect(layer.childNodes.length).toBe(3);
                expect(layer.childNodes[2].className).toBe('fcui2-button fcui2-button-normal browser-chrome');
                TestUtils.Simulate.click(layer.childNodes[2]);
                expect(dom.state.layerOpen).toBe(false);
                dom.close();
            });

            it('Enter Click', () => {
                let value = '';
                let change = function (e) {
                    value = e.target.value;
                };
                let dom = realRender(DropDownRegion, {
                    value: '1',
                    onChange: change
                });
                dom.onEnterClick({});
                expect(value).toBe('1');
                dom = realRender(DropDownRegion, {
                    value: '2',
                    disabled: true,
                    onChange: change
                });
                dom.onEnterClick({});
                expect(value).toBe('1');
            });

            it('Change Handler', () => {
                let value = '';
                let change = function (e) {
                    value = e.target.value;
                };
                // single
                let dom = realRender(DropDownRegion, {
                    value: '1',
                    type: 'single',
                    onChange: change
                });
                dom.onRegionChange({target: {value: '2'}});
                expect(value).toBe('2');
                dom = realRender(DropDownRegion, {
                    value: '2',
                    type: 'single',
                    disabled: true,
                    onChange: change
                });
                dom.onRegionChange({target: {value: '3'}});
                expect(value).toBe('2');
                // multi
                value = '';
                dom = realRender(DropDownRegion, {
                    value: '1',
                    onChange: change
                });
                dom.onRegionChange({target: {value: '2'}});
                expect(dom.state.multiValue).toBe('2');
                expect(value).toBe('');
                dom = realRender(DropDownRegion, {
                    value: '1',
                    disabled: true,
                    onChange: change
                });
                dom.onRegionChange({target: {value: '4'}});
                expect(dom.state.multiValue).toBe('1');
                expect(value).toBe('');
            });

        });

    });
});
