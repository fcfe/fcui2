/**
 * @file Specs for DualTreeSelector
 * @author Brian Li (lbxxlht@163.com)
 * @date  07/03/2016
 */

define(function (require) {


    const _ = require('underscore');
    const React = require('react');
    const ReactDOM = require('react-dom');
    const TestUtils = React.addons.TestUtils;
    const DualTreeSelector = require('enterprise/DualTreeSelector.jsx');


    function realRender(Component, props) {
        return TestUtils.renderIntoDocument(<Component {...props} />);
    }

    let datasource = [
        {label: '1', value: '1'},
        {label: '2', value: '2'},
        {
            label: '3', value: '3', children: [
                {label: '3-1', value: '3-1'},
                {label: '3-2', value: '3-2'}
            ]
        }
    ];

    describe('DualTreeSelector', () => {

        describe('Base Testing', () => {

            it('Normal', () => {
                let dom = realRender(DualTreeSelector, {
                    datasource: datasource
                });
                expect(dom.refs.container.className).toBe(
                    'fcui2-dualtreeselector-enterprise fcui2-dualtreeselector-enterprise-normal'
                );
                expect(dom.refs.container.childNodes.length).toBe(4);
                let element1 = React.createElement(DualTreeSelector, {
                    datasource: datasource,
                    isDropDown: true
                });
                ReactDOM.render(element1, dom.refs.container.parentNode);
                expect(dom.refs.dropdownContainer.className).toBe('fcui2-dropdownlist fcui2-dropdownlist-normal');
                expect(dom.refs.dropdownContainer.childNodes.length).toBe(3);
            });

            it('dropdown', () => {
                let value = '';
                let dom = realRender(DualTreeSelector, {
                    datasource: datasource,
                    isDropDown: true,
                    onChange(e) {
                        value = e.target.value;
                    }
                });
                expect(dom.refs.container).toBe();
                TestUtils.Simulate.click(dom.refs.dropdownContainer);
                expect(dom.state.layerOpen).toBe(true);
                expect(dom.refs.container.className).toBe(
                    'fcui2-dualtreeselector-enterprise fcui2-dualtreeselector-enterprise-normal'
                );
                let selector = dom.refs.dualTreeSelector;
                expect(selector.refs.container.className).toBe('fcui2-dualtreeselector fcui2-dualtreeselector-normal');
                selector.___dispatchChange___({
                    target: {
                        value: JSON.stringify({
                            selected: {'1': true}
                        })
                    }
                });
                expect(dom.state.dropdownValue).toBe('{"selected":{"1":true}}');
            });

        });

    });
});
