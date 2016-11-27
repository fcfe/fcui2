/**
 * @file Specs for Tip
 * @author Brian Li (lbxxlht@163.com)
 * @author Wang Yi(wangyispaceman@gmail.com)
 * @date 07/03/2016
 */

define(function (require) {
    const React = require('react');
    const TestUtils = React.addons.TestUtils;
    const Tip = require('Tip.jsx');
    const Layer = require('Layer.jsx');

    function shallowRender(Component, props = {}) {
        let renderer = TestUtils.createRenderer();
        renderer.render(<Component {...props} />);
        return renderer.getRenderOutput();
    }

    function realRender(Component, props = {}) {
        return TestUtils.renderIntoDocument(<Component {...props} />);
    }

    describe('Tip', () => {
        // Testing structure
        describe('Testing Tip with shallow render', () => {
            let tipProps = {};

            beforeEach(() => {
                tipProps = {
                    skin: 'test-skin',
                    className: 'fcui2-tip-test',
                    style: {
                        color: '#FFF'
                    },
                    disabled: true,
                    title: 'This is title',
                    content: 'This is content',
                    layerLocation: 'top'
                };
            });

            it('Renders a tip with default props', () => {
                let tip = shallowRender(Tip);
                expect(tip.type).toBe('div');
                expect(tip.props.className).toBe('fcui2-tip fcui2-tip-normal browser-chrome font-icon font-icon-hint-question-s');
                expect(tip.props.style).toEqual({display: 'none'});
                expect(tip.props.children[0]).toBeNull();
                expect(tip.props.children[1].type).toEqual(Layer);
            });

            it('Renders a tip with given props', () => {
                let tip = shallowRender(Tip, tipProps);
                expect(tip.type).toBe('div');
                expect(tip.props.className).toBe(
                    'fcui2-tip fcui2-tip-test-skin fcui2-tip-test fcui2-tip-disabled browser-chrome'
                        + ' font-icon font-icon-hint-question-s'
                );
                expect(tip.props.style).toEqual({color: '#FFF'});

                let layer = tip.props.children[1];
                expect(layer.type).toEqual(Layer);
                expect(layer.props.location).toBe('top');
                expect(layer.props.children.props.children).toEqual([
                    <div className="tip-title">This is title</div>,
                    <div className="tip-content" dangerouslySetInnerHTML={{__html: 'This is content'}}></div>
                ]);
            });
        });

        // Testing behaviour
        describe('Testing Tip through simulate events', () => {
            it('Simulating mouse events on a tip', () => {
                jasmine.clock().install();
                let tipProps = {
                    onOffset() {}
                };
                spyOn(tipProps, 'onOffset').and.callThrough();
                let tip = realRender(Tip, tipProps);
                let containerDom = TestUtils.findRenderedDOMComponentWithTag(tip, 'div');
                expect(tip.state.layerOpen).not.toBe(true);

                TestUtils.Simulate.mouseEnter(containerDom);
                expect(tip.state.layerOpen).toBe(true);

                tip.offsetLayerPosition();
                expect(tip.props.onOffset.calls.any()).toBe(true);
                expect(tip.props.onOffset.calls.count()).toBe(1);

                TestUtils.Simulate.mouseLeave(containerDom);
                jasmine.clock().tick(201);
                expect(tip.state.layerOpen).not.toBe(true);
                jasmine.clock().uninstall();
            });

            it('test position', () => {
                let e = {
                    left: 30,
                    top: 50,
                    clockPosition: '1'
                };
                let dom = realRender(Tip, {});
                dom.offsetLayerPosition(e);
                expect(e.left).toBe(40);
                expect(e.top).toBe(45);
                e.clockPosition = '7';
                dom.offsetLayerPosition(e);
                expect(e.left).toBe(25);
                expect(e.top).toBe(55);
                dom = realRender(Tip, {
                    onOffset(e) {
                        e.left = 0;
                        e.top = 0;
                    }
                });
                dom.offsetLayerPosition(e);
                expect(e.left).toBe(0);
                expect(e.top).toBe(0);
            });
        });
    });
});
