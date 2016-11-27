/**
 * @file Specs for Radio
 * @author Brian Li (lbxxlht@163.com)
 * @date  07/03/2016
 */

define(function (require) {

    const _ = require('underscore');
    const React = require('react');
    const TestUtils = React.addons.TestUtils;
    const Radio = require('Radio.jsx');

    function shallowRender(Component, props) {
        props = props || {};
        let renderer = TestUtils.createRenderer();
        renderer.render(<Component {...props} />);
        return renderer.getRenderOutput();
    }

    function realRender(Component, props = {}) {
        return TestUtils.renderIntoDocument(<Component {...props} />);
    }

    describe('Radio', () => {
        // Testing structure
        describe('Base Testing', () => {

            let radioProp = {};
            beforeEach(() => {
                radioProp = {
                    skin: 'test-skin',
                    className: 'test-class',
                    indeterminate: true,
                    label: 'Radio label',
                    disabled: false,
                    value: 'test-Radio',
                    onChange(e) {}
                };
            });


            it('Readers a Radio with custom props in real renderer', () => {
                spyOn(radioProp, 'onChange').and.callThrough();
                let dom = realRender(Radio, radioProp);
                TestUtils.Simulate.click(dom.refs.container.childNodes[2]);
                let event = dom.props.onChange.calls.mostRecent().args[0];
                expect(event.target.value).toEqual('test-Radio');
                TestUtils.Simulate.change(dom.refs.inputbox, {target: {checked: true}});
                let event2 = dom.props.onChange.calls.mostRecent().args[0];
                expect(event2.target.checked).toEqual(true);
            });

            it('Disabled Radio', () => {
                let dom = realRender(Radio, {
                    disabled: true,
                    onChange: _.noop
                });
                spyOn(radioProp, 'onChange').and.callThrough();
                TestUtils.Simulate.click(dom.refs.container.childNodes[2]);
                TestUtils.Simulate.change(dom.refs.inputbox, {target: {checked: true}});
                let event2 = dom.props.onChange.calls;
                expect(event2).toEqual(undefined);
            });

        });

    });
});
