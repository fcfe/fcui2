/**
 * @file Specs for TextArea
 * @author Brian Li (lbxxlht@163.com)
 * @date  07/03/2016
 */

define(function (require) {

    const _ = require('underscore');
    const React = require('react');
    const TestUtils = React.addons.TestUtils;
    const TextArea = require('TextArea.jsx');

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

    describe('TextArea', () => {
        // Testing structure
        describe('Base Testing', () => {

            it('Readers a TextArea with default props', () => {
                let dom = shallowRender(TextArea);
                expect(dom.type).toBe('div');
                expect(dom.props.children[0]).toEqual(
                    <div style={{visibility: 'visible'}}>{''}</div>
                );
                let child1 = dom.props.children[1];
                expect(child1).toEqual(
                    <textarea
                        ref="inputbox" disabled={false} spellCheck={false}
                        style={{
                            width: 378,
                            height: 278
                        }}
                        onCompositionStart={child1.props.onCompositionStart}
                        onCompositionEnd={child1.props.onCompositionEnd}
                        onKeyUp={child1.props.onKeyUp}
                        onPaste={child1.props.onPaste}
                        onBlur={child1.props.onBlur}
                        onFocus={child1.props.onFocus}
                    ></textarea>
                );
                let realDom = realRender(TextArea);
                realDom.focus();
            });

            it('Readers a TextArea with value', () => {
                let dom = shallowRender(TextArea, {
                    value: 'abc'
                });
                let child1 = dom.props.children[1];
                expect(dom.props.children[0]).toEqual(
                    <div style={{visibility: 'hidden'}}>{''}</div>
                );
                expect(child1).toEqual(
                    <textarea
                        ref="inputbox" disabled={false} spellCheck={false}
                        style={{
                            width: 378,
                            height: 278
                        }}
                        onCompositionStart={child1.props.onCompositionStart}
                        onCompositionEnd={child1.props.onCompositionEnd}
                        onKeyUp={child1.props.onKeyUp}
                        onPaste={child1.props.onPaste}
                        onBlur={child1.props.onBlur}
                        onFocus={child1.props.onFocus}
                    ></textarea>
                );
            });

            it('Readers a TextArea with incorrect property width', () => {
                let dom = shallowRender(TextArea, {
                    width: 'abc',
                    height: 'abc'
                });
                let child1 = dom.props.children[1];
                expect(child1).toEqual(
                    <textarea
                        ref="inputbox" disabled={false} spellCheck={false}
                        style={{
                            width: 378,
                            height: 278
                        }}
                        onCompositionStart={child1.props.onCompositionStart}
                        onCompositionEnd={child1.props.onCompositionEnd}
                        onKeyUp={child1.props.onKeyUp}
                        onPaste={child1.props.onPaste}
                        onBlur={child1.props.onBlur}
                        onFocus={child1.props.onFocus}
                    ></textarea>
                );
            });

            it('Readers a TextArea with incorrect property value', () => {
                let dom = shallowRender(TextArea, {
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
