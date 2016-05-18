/**
 * @file Specs for Button
 * @author Wang Yi(wangyispaceman@gmail.com)
 * @date Fri May 13 2016
 */

define(function (require) {
    const _ = require('underscore');
    const React = require('react');
    const TestUtils = React.addons.TestUtils;
    const Button = require('Button.jsx');

    function shallowRender(Component, props = {}) {
        let renderer = TestUtils.createRenderer();
        renderer.render(<Component {...props} />);
        return renderer.getRenderOutput();
    }

    function realRender(Component, props = {}) {
        return TestUtils.renderIntoDocument(<Component {...props} />);
    }

    describe('Button', () => {
        // Testing structure
        describe('Testing Button with shallow render', () => {
            let buttonProps = {};

            beforeEach(() => {
                buttonProps = {
                    className: 'fcui2-button-test',
                    style: {
                        color: '#FFF'
                    },
                    skin: 'test-skin',
                    disabled: false,
                    label: 'testing label',
                    title: 'testing title',
                    icon: 'icon-test',
                    name: 'test',
                    value: 'testing value'
                };
            });

            it('Readers a button with default props', () => {
                let button = shallowRender(Button);
                expect(button.type).toBe('div');
                expect(button.props.className).toBe('fcui2-button');
                expect(button.props.title).toBe('');
                expect(button.props.style).toEqual({});
                expect(button.props.children).toEqual([null, <input type="button" name="" value="Button" />]);
            });

            it('Renders a button with given props', () => {
                let button = shallowRender(Button, buttonProps);
                expect(button.type).toBe('div');
                expect(button.props.className).toBe('fcui2-button fcui2-button-test fcui2-button-test-skin');
                expect(button.props.title).toBe('testing title');
                expect(button.props.style).toEqual({color: '#FFF'});
                expect(button.props.children).toEqual([
                    <div className="font-icon icon-test"/>,
                    <input type="button" name="test" value="testing label" style={{textAlign: 'left'}} />
                ]);
            });

            it('Renders a disabled button', () => {
                let disabledProps = _.extend(buttonProps, {disabled: true});
                let button = shallowRender(Button, disabledProps);
                expect(button.type).toBe('div');
                expect(button.props.className).toBe('fcui2-button fcui2-button-test fcui2-button-disabled');
            });
        });

        // Testing behaviour
        describe('Testing Button through simulate events', () => {
            let data = 0;
            let buttonProps = {};

            beforeEach(() => {
                data = 0;
                buttonProps = {
                    value: 'buttonValue',
                    onClick() {
                        data = 1;
                    }
                };
            });

            it('Simulating click event on a button', () => {
                spyOn(buttonProps, 'onClick').and.callThrough();
                let button = realRender(Button, buttonProps);
                let buttonDom = TestUtils.findRenderedDOMComponentWithTag(button, 'input');
                expect(data).toBe(0);

                TestUtils.Simulate.click(buttonDom);
                expect(button.props.onClick).toHaveBeenCalled();
                expect(button.props.onClick.calls.count()).toBe(1);
                expect(data).toBe(1);

                let event = button.props.onClick.calls.mostRecent().args[0];
                expect(event.target).toEqual(button.refs.container);
                expect(event.target.value).toBe('buttonValue');
            });

            it('Simulating click event on a disabled button', () => {
                let disabledProps = _.extend(buttonProps, {disabled: true});
                spyOn(buttonProps, 'onClick').and.callThrough();
                let button = realRender(Button, buttonProps);
                let buttonDom = TestUtils.findRenderedDOMComponentWithTag(button, 'input');
                expect(data).toBe(0);

                TestUtils.Simulate.click(buttonDom);
                expect(button.props.onClick).not.toHaveBeenCalled();
                expect(data).toBe(0);
            });

            it('Simulating other mouse events on a button', () => {
                let mouseEventsProps = _.extend(buttonProps, {
                    onMouseEnter: _.noop,
                    onMouseLeave: _.noop
                });
                mouseEventsProps = jasmine.createSpyObj('mouseEventsProps', ['onMouseEnter', 'onMouseLeave']);
                let button = realRender(Button, mouseEventsProps);
                let containerDom = TestUtils.findRenderedDOMComponentWithTag(button, 'div');
                expect(button.state.mousedown).not.toBe(true);

                TestUtils.Simulate.mouseEnter(containerDom);
                expect(button.props.onMouseEnter).toHaveBeenCalled();
                expect(button.props.onMouseEnter.calls.count()).toBe(1);

                TestUtils.Simulate.mouseLeave(containerDom);
                expect(button.props.onMouseLeave).toHaveBeenCalled();
                expect(button.props.onMouseLeave.calls.count()).toBe(1);

                TestUtils.Simulate.mouseDown(containerDom);
                expect(button.state.mousedown).toBe(true);

                TestUtils.Simulate.mouseUp(containerDom);
                expect(button.state.mousedown).toBe(false);
            });
        });
    });
});
