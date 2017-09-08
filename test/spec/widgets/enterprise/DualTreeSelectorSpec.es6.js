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
                    datasource: datasource,
                    labels: ''
                });
                expect(dom.refs.container.className).toBe(
                    'fcui2-dualtreeselector-enterprise fcui2-dualtreeselector-enterprise-normal browser-chrome'
                );
                expect(dom.refs.container.childNodes.length).toBe(4);
                let element1 = React.createElement(DualTreeSelector, {
                    datasource: datasource,
                    isDropDown: true
                });
                ReactDOM.render(element1, dom.refs.container.parentNode);
                expect(dom.refs.dropdownContainer.className).toBe('fcui2-dropdownlist fcui2-dropdownlist-normal browser-chrome');
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
                expect(selector.refs.container.className).toBe('fcui2-dualtreeselector fcui2-dualtreeselector-normal browser-chrome');
                selector.___dispatchChange___({
                    target: {
                        value: JSON.stringify({
                            selected: {'1': true}
                        })
                    }
                });
                expect(dom.state.dropdownValue).toBe('{"selected":{"1":true}}');
                let enterButton = dom.refs.layer.___renderContainer___.childNodes[0].childNodes[1];
                TestUtils.Simulate.click(enterButton);
                expect(value).toBe('{"selected":{"1":true}}');

                value = '';
                TestUtils.Simulate.click(dom.refs.dropdownContainer);
                selector = dom.refs.dualTreeSelector;
                selector.___dispatchChange___({
                    target: {
                        value: JSON.stringify({
                            selected: {'1': true}
                        })
                    }
                });
                let cancelButton = dom.refs.layer.___renderContainer___.childNodes[0].childNodes[2];
                TestUtils.Simulate.click(cancelButton);
                expect(value).toBe('');
                expect(dom.state.layerOpen).toBe(false);

                TestUtils.Simulate.click(dom.refs.dropdownContainer);
                selector = dom.refs.dualTreeSelector;
                selector.___dispatchChange___({
                    target: {
                        value: JSON.stringify({
                            selected: {'1': true}
                        })
                    }
                });
                expect(dom.state.dropdownValue).toBe('{"selected":{"1":true}}');
                expect(dom.refs.container.childNodes[3].childNodes[1].childNodes[0].innerHTML).toBe('全部删除');
                TestUtils.Simulate.click(dom.refs.container.childNodes[3].childNodes[1].childNodes[0]);
                expect(dom.state.dropdownValue).toBe('{"selected":{}}');

                expect(dom.refs.container.childNodes[3].childNodes[0].childNodes[0].innerHTML).toBe('全部添加');
                TestUtils.Simulate.click(dom.refs.container.childNodes[3].childNodes[0].childNodes[0]);
                expect(dom.state.dropdownValue).toBe('{"selected":{"1":true,"2":true,"3-1":true,"3-2":true}}');
            });

            it('not dropdown', () => {
                let value = '';
                let dom = realRender(DualTreeSelector, {
                    datasource: datasource,
                    onChange(e) {
                        value = e.target.value;
                    }
                });
                let selector = dom.refs.dualTreeSelector;
                selector.___dispatchChange___({
                    target: {
                        value: JSON.stringify({
                            selected: {'1': true}
                        })
                    }
                });
                expect(dom.state.dropdownValue).toBe('{"selected":{}}');
                expect(value).toBe('{"selected":{"1":true}}');
                let leftTree = dom.refs.dualTreeSelector.refs.container.childNodes[0].childNodes[0];
                TestUtils.Simulate.click(leftTree.childNodes[2].childNodes[1]);
                expect(JSON.stringify(dom.state.expand)).toBe('{"3":true}');

                expect(dom.refs.container.childNodes[3].childNodes[1].childNodes[0].innerHTML).toBe('全部删除');
                TestUtils.Simulate.click(dom.refs.container.childNodes[3].childNodes[1].childNodes[0]);
                expect(value).toBe('{"selected":{}}');

                expect(dom.refs.container.childNodes[3].childNodes[0].childNodes[0].innerHTML).toBe('全部添加');
                TestUtils.Simulate.click(dom.refs.container.childNodes[3].childNodes[0].childNodes[0]);
                expect(value).toBe('{"selected":{"1":true,"2":true,"3-1":true,"3-2":true}}');
            });

            it('with value', () => {
                let value = '';
                let dom = realRender(DualTreeSelector, {
                    datasource: datasource,
                    value: '{"selected":{"1":true}}',
                    onChange(e) {
                        value = e.target.value;
                    }
                });
                let selector = dom.refs.dualTreeSelector;
                expect(selector.props.value).toBe('{"selected":{"1":true}}');

                dom = realRender(DualTreeSelector, {
                    datasource: datasource,
                    isDropDown: true,
                    clearTemporaryAfterLayerClose: true,
                    value: '{"selected":{"1":true}}',
                    onChange(e) {
                        value = e.target.value;
                    }
                });
                TestUtils.Simulate.click(dom.refs.dropdownContainer);
                selector = dom.refs.dualTreeSelector;
                expect(selector.refs.container.className).toBe('fcui2-dualtreeselector fcui2-dualtreeselector-normal browser-chrome');
                selector.___dispatchChange___({
                    target: {
                        value: JSON.stringify({
                            selected: {'2': true}
                        })
                    }
                });
                expect(dom.state.dropdownValue).toBe('{"selected":{"2":true}}');
                let cancelButton = dom.refs.layer.___renderContainer___.childNodes[0].childNodes[2];
                TestUtils.Simulate.click(cancelButton);
                expect(dom.state.dropdownValue).toBe('{"selected":{"1":true}}');
                TestUtils.Simulate.click(dom.refs.dropdownContainer);
                selector = dom.refs.dualTreeSelector;
                let enterButton = dom.refs.layer.___renderContainer___.childNodes[0].childNodes[1];
                TestUtils.Simulate.click(enterButton);
            });
        });

    });
});
