/**
 * @file Specs for NumberBox
 * @author Brian Li (lbxxlht@163.com)
 * @date  07/03/2016
 */

define(function (require) {

    const _ = require('underscore');
    const React = require('react');
    const TestUtils = React.addons.TestUtils;
    const NumberBox = require('NumberBox.jsx');

    function shallowRender(Component, props) {
        props = props || {};
        let renderer = TestUtils.createRenderer();
        renderer.render(<Component {...props} />);
        return renderer.getRenderOutput();
    }

    function realRender(Component, props) {
        props = props || {};
        return TestUtils.renderIntoDocument(<Component {...props} />);
    }

    describe('NumberBox', () => {
        // Testing structure
        describe('Base Testing', () => {

            it('Readers a NumberBox with default props', () => {
                let dom = shallowRender(NumberBox);
                let child1 = dom.props.children[1];
                expect(dom.type).toBe('div');
                expect(dom.props.children[0]).toEqual(
                    <div className="fcui2-numberbox-placeholder" style={{visibility: 'visible'}}>{''}</div>
                );
                expect(child1).toEqual(
                    <input
                        type="text" ref="inputbox" disabled={false} value=""
                        style={{
                            height: 26,
                            width: 158,
                            paddingLeft: 10,
                            paddingRight: 30
                        }}
                        onChange={child1.props.onChange}
                        onKeyDown={child1.props.onKeyDown}
                        onBlur={child1.props.onBlur}
                    />
                );
            });

            it('Readers a NumberBox with props', () => {
                let dom = shallowRender(NumberBox, {
                    showSpinButton: false,
                    width: 'abc'
                });
                let child1 = dom.props.children[1];
                expect(child1).toEqual(
                    <input
                        type="text" ref="inputbox" disabled={false} value=""
                        style={{
                            height: 26,
                            width: 178,
                            paddingLeft: 10,
                            paddingRight: 10
                        }}
                        onChange={child1.props.onChange}
                        onKeyDown={child1.props.onKeyDown}
                        onBlur={child1.props.onBlur}
                    />
                );
            });

            it('Readers a NumberBox with realRenderer', () => {
                let value = 0;
                let props =  {
                    onChange: function (e) {
                        value = e.target.value * 1;
                    }
                };
                let dom = realRender(NumberBox, props);
                TestUtils.Simulate.change(dom.refs.inputbox, {target: {value: 7}});
                expect(value).toBe(7);
                TestUtils.Simulate.keyDown(dom.refs.inputbox, {key: '8'});
                TestUtils.Simulate.blur(dom.refs.inputbox, {});
                TestUtils.Simulate.click(dom.refs.container.childNodes[2].childNodes[0]);
                expect(value).toBe(8);
                dom.focus();
                expect(dom.___cursorPosition___ ).toBe(-1);
                TestUtils.Simulate.click(dom.refs.container.childNodes[2].childNodes[1]);
                expect(value).toBe(7);
            });

            it('Disabled NumberBox', () => {
                let value = 0;
                let props =  {
                    disabled: true,
                    onChange: function (e) {
                        value = e.target.value * 1;
                    }
                };
                let dom = realRender(NumberBox, props);
                TestUtils.Simulate.change(dom.refs.inputbox, {target: {value: 7}});
                expect(value).toBe(0);
                TestUtils.Simulate.keyDown(dom.refs.inputbox, {key: '8'});
                TestUtils.Simulate.blur(dom.refs.inputbox, {});
                TestUtils.Simulate.click(dom.refs.container.childNodes[2].childNodes[0]);
                expect(value).toBe(0);
                dom.focus();
                expect(dom.___cursorPosition___ ).toBe(-1);
            });

        });

    });
});
