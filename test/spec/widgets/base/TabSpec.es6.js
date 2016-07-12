/**
 * @file Specs for Tab
 * @author Brian Li (lbxxlht@163.com)
 * @author Wang Yi(wangyispaceman@gmail.com)
 * @date 07/03/2016
 */

define(function (require) {
    const _ = require('underscore');
    const React = require('react');
    const TestUtils = React.addons.TestUtils;
    const Tab = require('Tab.jsx');
    const componentTools = require('core/componentTools');

    function shallowRender(Component, props = {}) {
        let renderer = TestUtils.createRenderer();
        renderer.render(<Component {...props} />);
        return renderer.getRenderOutput();
    }

    function realRender(Component, props = {}) {
        return TestUtils.renderIntoDocument(<Component {...props} />);
    }

    describe('Tab', () => {
        // Testing structure
        describe('Testing Tab with shallow render', () => {
            let tabProps = {};
            let datasource = [
                {label: 'Tab-1', value: 'alpha'},
                {label: 'Tab-2', value: 'beta', disabled: true},
                {label: 'Tab-3', value: 'gamma'}
            ];

            beforeEach(() => {
                tabProps = {
                    skin: 'test-skin',
                    className: 'fcui2-tab-test',
                    style: {
                        color: '#FFF'
                    },
                    datasource: datasource,
                    value: 'alpha'
                };
            });

            it('Renders a tab with default props', () => {
                let tab = shallowRender(Tab);
                expect(tab.type).toBe('div');
                expect(tab.props.className).toBe('fcui2-tab fcui2-tab-normal');
                expect(tab.props.style).toEqual({});
                expect(tab.props.children).toBeNull();
            });

            it('Renders a tab with given props', () => {
                let tab = shallowRender(Tab, tabProps);
                expect(tab.type).toBe('div');
                expect(tab.props.className).toBe('fcui2-tab fcui2-tab-test fcui2-tab-test-skin');
                expect(tab.props.style).toEqual({color: '#FFF'});

                let TabItem = Tab.defaultProps.renderer;
                let onClick = tab.props.children[0].props.onClick;
                expect(tab.props.children).toEqual([
                    <TabItem key="0" className="fcui2-tab-item-active" label="Tab-1" value="alpha" onClick={onClick} />,
                    <TabItem key="1" className="fcui2-tab-item-disabled" disabled={true} label="Tab-2" value="beta" onClick={componentTools.noop} />,
                    <TabItem key="2" className="fcui2-tab-item" label="Tab-3" value="gamma" onClick={onClick} />
                ]);
            });
        });

        // Testing behaviour
        describe('Testing Tab through simulate events', () => {
            let tabProps = {};
            let datasource = [
                {label: 'Tab-1', value: 'alpha'},
                {label: 'Tab-2', value: 'beta'},
                {label: 'Tab-3', value: 'gamma'}
            ];
            let currentValue = '';

            beforeEach(() => {
                currentValue = 'alpha';
                tabProps = {
                    datasource: datasource,
                    value: currentValue,
                    onChange(e) {
                        currentValue = e.target.value;
                    }
                };
            });

            it('Simulating click event on a tab', () => {
                spyOn(tabProps, 'onChange').and.callThrough();
                let tab = realRender(Tab, tabProps);
                let Item = Tab.defaultProps.renderer;
                let tabItems = TestUtils.scryRenderedComponentsWithType(tab, Item);
                expect(currentValue).toBe('alpha');
                expect(tab.props.onChange.calls.any()).toBeFalsy();

                let tabItemDom1 = TestUtils.findRenderedDOMComponentWithTag(tabItems[1], 'div');
                TestUtils.Simulate.click(tabItemDom1);
                let event = tab.props.onChange.calls.mostRecent().args[0];
                expect(tab.props.onChange.calls.any()).toBeTruthy();
                expect(tab.props.onChange.calls.count()).toBe(1);
                expect(event.target.value).toBe('beta');
                expect(currentValue).toBe('beta');

                tab.props.onChange.calls.reset();
                let tabItemDom2 = TestUtils.findRenderedDOMComponentWithTag(tabItems[2], 'div');
                TestUtils.Simulate.click(tabItemDom2);
                event = tab.props.onChange.calls.mostRecent().args[0];
                expect(tab.props.onChange.calls.any()).toBeTruthy();
                expect(tab.props.onChange.calls.count()).toBe(1);
                expect(event.target.value).toBe('gamma');
                expect(currentValue).toBe('gamma');
            });

            it('Simulating click event on a tab with disabled item', () => {
                tabProps.datasource[1] = _.extend(tabProps.datasource[1], {disabled: true});
                spyOn(tabProps, 'onChange').and.callThrough();
                let tab = realRender(Tab, tabProps);
                let Item = Tab.defaultProps.renderer;
                let tabItems = TestUtils.scryRenderedComponentsWithType(tab, Item);
                expect(currentValue).toBe('alpha');
                expect(tab.props.onChange.calls.any()).toBeFalsy();

                let tabItemDom1 = TestUtils.findRenderedDOMComponentWithTag(tabItems[1], 'div');
                TestUtils.Simulate.click(tabItemDom1);
                expect(tab.props.onChange.calls.any()).toBeFalsy();
                expect(tab.props.onChange.calls.count()).toBe(0);
                expect(currentValue).toBe('alpha');

                tab.props.onChange.calls.reset();
                let tabItemDom0 = TestUtils.findRenderedDOMComponentWithTag(tabItems[0], 'div');
                TestUtils.Simulate.click(tabItemDom0);
                expect(tab.props.onChange.calls.any()).toBeFalsy();
                expect(tab.props.onChange.calls.count()).toBe(0);
                expect(currentValue).toBe('alpha');
            });
        });
    });
});
