/**
 * @file Specs for CheckBox
 * @author Brian Li (lbxxlht@163.com)
 * @date  07/03/2016
 */

define(function (require) {

    const _ = require('underscore');
    const React = require('react');
    const TestUtils = React.addons.TestUtils;
    const CheckBox = require('CheckBox.jsx');

    function shallowRender(Component, props = {}) {
        let renderer = TestUtils.createRenderer();
        renderer.render(<Component {...props} />);
        return renderer.getRenderOutput();
    }

    function realRender(Component, props = {}) {
        return TestUtils.renderIntoDocument(<Component {...props} />);
    }

    describe('CheckBox', () => {

        describe('Base Testing', () => {

            let checkboxProp = {};
            beforeEach(() => {
                checkboxProp = {
                    skin: 'test-skin',
                    className: 'test-class',
                    indeterminate: true,
                    label: 'checkbox label',
                    disabled: false,
                    value: 'test-checkbox',
                    onChange(e) {}
                };
            });

            it('Readers a CheckBox with default props', () => {
                let vDom = shallowRender(CheckBox);
                let onChange = vDom.props.children[0].props.onChange
                expect(vDom.type).toBe('div');
                expect(vDom.props.className).toBe('fcui2-checkbox fcui2-checkbox-normal browser-chrome');
                expect(vDom.props.children[0]).toEqual(
                    <input type="checkbox" key="input"
                        ref="inputbox" disabled={false} value="" checked={false}
                        onChange={onChange}/>
                );
            });

            it('Readers a CheckBox with custom props in real renderer', () => {
                spyOn(checkboxProp, 'onChange').and.callThrough();
                let dom = realRender(CheckBox, checkboxProp);
                TestUtils.Simulate.click(dom.refs.container.childNodes[1]);
                let event = dom.props.onChange.calls.mostRecent().args[0];
                expect(event.target.value).toEqual('test-checkbox');
                TestUtils.Simulate.change(dom.refs.inputbox, {target: {checked: true}});
                let event2 = dom.props.onChange.calls.mostRecent().args[0];
                expect(event2.target.checked).toEqual(true);
            });

            it('Disabled CheckBox', () => {
                let dom = realRender(CheckBox, {
                    disabled: true,
                    onChange: _.noop
                });
                TestUtils.Simulate.click(dom.refs.container.childNodes[1]);
                TestUtils.Simulate.change(dom.refs.inputbox, {target: {checked: true}});
                let event2 = dom.props.onChange.calls;
                expect(event2).toEqual(undefined);
            });

            it('CheckBox with left label', () => {
                let dom = shallowRender(CheckBox, {
                    label: 'left label',
                    labelPosition: 'left'
                });
                let onClick = dom.props.children[0].props.onClick
                expect(dom.props.children[0]).toEqual(
                    <span key="label" ref={null} className="fcui2-checkbox-label" onClick={onClick}>left label</span>
                );
            });

        });

    });
});
