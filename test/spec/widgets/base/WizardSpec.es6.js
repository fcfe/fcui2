/**
 * @file Specs for Wizard
 * @author Brian Li (lbxxlht@163.com)
 * @author Wang Yi(wangyispaceman@gmail.com)
 * @date 07/03/2016
 */

define(function (require) {
    const _ = require('underscore');
    const React = require('react');
    const TestUtils = React.addons.TestUtils;
    const Wizard = require('Wizard.jsx');

    function shallowRender(Component, props = {}) {
        let renderer = TestUtils.createRenderer();
        renderer.render(<Component {...props} />);
        return renderer.getRenderOutput();
    }

    function realRender(Component, props = {}) {
        return TestUtils.renderIntoDocument(<Component {...props} />);
    }

    describe('Wizard', () => {
        // Testing structure
        describe('Testing Wizard with shallow render', () => {
            let wizardProps = {};
            let datasource = [
                'Step1',
                'Step2',
                'Step3'
            ];

            beforeEach(() => {
                wizardProps = {
                    skin: 'test-skin',
                    className: 'fcui2-wizard-test',
                    style: {
                        color: '#FFF'
                    },
                    datasource: datasource,
                    value: 1
                };
            });

            it('Renders a wizard with default props', () => {
                let wizard = shallowRender(Wizard);
                expect(wizard.type).toBe('div');
                expect(wizard.props.className).toBe('fcui2-wizard fcui2-wizard-normal browser-chrome');
                expect(wizard.props.style).toEqual({});
                expect(wizard.props.children).toBe('');
            });

            it('Renders a wizard with given props', () => {
                let wizard = shallowRender(Wizard, wizardProps);
                expect(wizard.type).toBe('div');
                expect(wizard.props.className).toBe('fcui2-wizard fcui2-wizard-test-skin fcui2-wizard-test browser-chrome');
                expect(wizard.props.style).toEqual({color: '#FFF'});

                let onClick = wizard.props.children[0].props.onClick;
                expect(wizard.props.children[0]).toEqual(
                    <div
                         key="0"
                         className="fcui2-wizard-item fcui2-wizard-item-active fcui2-wizard-item-pre"
                         data-ui-cmd={0}
                         style={{width: '33.33%', zIndex: 3}}
                         onClick={onClick}
                    >
                        <span data-ui-cmd={0}>Step1</span>
                        <div data-ui-cmd={0} className="fcui2-wizard-arrow-bg"></div>
                        <div data-ui-cmd={0} className="fcui2-wizard-arrow">
                            <span data-ui-cmd={0}>{1}</span>
                        </div>
                    </div>
                );
                expect(wizard.props.children[1]).toEqual(
                    <div
                         key="1"
                         className="fcui2-wizard-item fcui2-wizard-item-active fcui2-wizard-item-current"
                         data-ui-cmd={1}
                         style={{width: '33.33%', zIndex: 2}}
                         onClick={onClick}
                    >
                        <span data-ui-cmd={1}>Step2</span>
                        <div data-ui-cmd={1} className="fcui2-wizard-arrow-bg"></div>
                        <div data-ui-cmd={1} className="fcui2-wizard-arrow">
                            <span data-ui-cmd={1}>{2}</span>
                        </div>
                    </div>
                );
                expect(wizard.props.children[2]).toEqual(
                    <div
                         key="2"
                         className="fcui2-wizard-item fcui2-wizard-item-normal"
                         data-ui-cmd={2}
                         style={{width: '33.33%', zIndex: 1}}
                         onClick={onClick}
                    >
                        <span data-ui-cmd={2}>Step3</span>
                        <div data-ui-cmd={2} className="fcui2-wizard-arrow-bg"></div>
                        <div data-ui-cmd={2} className="fcui2-wizard-arrow">
                            <span data-ui-cmd={2}>{3}</span>
                        </div>
                    </div>
                );
            });
        });

        // Testing behaviour
        describe('Testing Wizard through simulate events', () => {
            let wizardProps = {};
            let datasource = [
                'Step1',
                'Step2',
                'Step3'
            ];
            let currentValue = 0;

            beforeEach(() => {
                currentValue = 0;
                wizardProps = {
                    value: currentValue,
                    datasource: datasource,
                    onChange(e) {
                        currentValue = e.target.value;
                    }
                };
            });

            it('Simulating click event on a wizard', () => {
                spyOn(wizardProps, 'onChange').and.callThrough();
                let wizard = realRender(Wizard, wizardProps);
                let stepItems = TestUtils.scryRenderedDOMComponentsWithClass(wizard, 'fcui2-wizard-item');
                expect(wizard.props.onChange.calls.any()).toBeFalsy();
                expect(currentValue).toBe(0);

                TestUtils.Simulate.click(stepItems[0]);
                let event = wizard.props.onChange.calls.mostRecent().args[0];
                expect(wizard.props.onChange.calls.any()).toBeTruthy();
                expect(wizard.props.onChange.calls.count()).toBe(1);
                expect(event.target.value).toBe(currentValue);
                expect(currentValue).toBe('0');

                wizard.props.onChange.calls.reset();
                TestUtils.Simulate.click(stepItems[1]);
                event = wizard.props.onChange.calls.mostRecent().args[0];
                expect(wizard.props.onChange.calls.any()).toBeTruthy();
                expect(wizard.props.onChange.calls.count()).toBe(1);
                expect(event.target.value).toBe(currentValue);
                expect(currentValue).toBe('1');

                wizard.props.onChange.calls.reset();
                TestUtils.Simulate.click(stepItems[2]);
                event = wizard.props.onChange.calls.mostRecent().args[0];
                expect(wizard.props.onChange.calls.any()).toBeTruthy();
                expect(wizard.props.onChange.calls.count()).toBe(1);
                expect(event.target.value).toBe(currentValue);
                expect(currentValue).toBe('2');
            });

            it('Simulating click event on a disabled wizard', () => {
                wizardProps = _.extend(wizardProps, {value: '', disabled: true});
                spyOn(wizardProps, 'onChange').and.callThrough();
                let wizard = realRender(Wizard, wizardProps);
                let stepItems = TestUtils.scryRenderedDOMComponentsWithClass(wizard, 'fcui2-wizard-item');
                expect(wizard.props.onChange.calls.any()).toBeFalsy();
                expect(currentValue).toBe(0);

                TestUtils.Simulate.click(stepItems[0]);
                expect(wizard.props.onChange.calls.any()).toBeFalsy();
                expect(currentValue).toBe(0);

                TestUtils.Simulate.click(stepItems[1]);
                expect(wizard.props.onChange.calls.any()).toBeFalsy();
                expect(currentValue).toBe(0);

                TestUtils.Simulate.click(stepItems[2]);
                expect(wizard.props.onChange.calls.any()).toBeFalsy();
                expect(currentValue).toBe(0);
            });
        });
    });
});
