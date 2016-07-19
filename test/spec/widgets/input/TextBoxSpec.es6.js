/**
 * @file Specs for TextBox
 * @author Brian Li (lbxxlht@163.com)
 * @date  07/03/2016
 */

define(function (require) {

    const _ = require('underscore');
    const React = require('react');
    const TestUtils = React.addons.TestUtils;
    const TextBox = require('TextBox.jsx');

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

    describe('TextBox', () => {
        // Testing structure
        describe('Base Testing', () => {

            it('Readers a TextBox with default props', () => {
                let dom = shallowRender(TextBox);
                expect(dom.type).toBe('div');
                expect(dom.props.children[0]).toEqual(
                    <div style={{visibility: 'visible'}}>{''}</div>
                );
                let child1 = dom.props.children[1];
                expect(child1).toEqual(
                    <input
                        type="text" ref="inputbox" disabled={false} style={{width: 178}}
                        onCompositionStart={child1.props.onCompositionStart}
                        onCompositionEnd={child1.props.onCompositionEnd}
                        onKeyUp={child1.props.onKeyUp}
                        onInput={child1.props.onInput}
                        onBlur={child1.props.onBlur}
                        onFocus={child1.props.onFocus}
                    />
                );
                let realDom = realRender(TextBox);
                realDom.focus();
            });

            it('Readers a TextBox with value', () => {
                let dom = shallowRender(TextBox, {
                    value: 'abc'
                });
                let child1 = dom.props.children[1];
                expect(dom.props.children[0]).toEqual(
                    <div style={{visibility: 'hidden'}}>{''}</div>
                );
                expect(child1).toEqual(
                    <input
                        type="text" ref="inputbox" disabled={false} style={{width: 178}}
                        onCompositionStart={child1.props.onCompositionStart}
                        onCompositionEnd={child1.props.onCompositionEnd}
                        onKeyUp={child1.props.onKeyUp}
                        onInput={child1.props.onInput}
                        onBlur={child1.props.onBlur}
                        onFocus={child1.props.onFocus}
                    />
                );
            });

            it('Readers a TextBox with incorrect property width', () => {
                let dom = shallowRender(TextBox, {
                    width: 'abc'
                });
                let child1 = dom.props.children[1];
                expect(child1).toEqual(
                    <input
                        type="text" ref="inputbox" disabled={false} style={{width: 178}}
                        onCompositionStart={child1.props.onCompositionStart}
                        onCompositionEnd={child1.props.onCompositionEnd}
                        onKeyUp={child1.props.onKeyUp}
                        onInput={child1.props.onInput}
                        onBlur={child1.props.onBlur}
                        onFocus={child1.props.onFocus}
                    />
                );
            });

            it('Readers a TextBox with incorrect property value', () => {
                let dom = shallowRender(TextBox, {
                    value: null,
                    valueTemplate: null
                });
                let child1 = dom.props.children[1];
                expect(dom.props.children[0]).toEqual(
                    <div style={{visibility: 'visible'}}>{''}</div>
                );
            });

        });

    });
});
