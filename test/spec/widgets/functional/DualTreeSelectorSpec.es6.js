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
    const DualTreeSelector = require('DualTreeSelector.jsx');


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
                let leftTree = dom.refs.container.childNodes[0].childNodes[0];
                let rightTree = dom.refs.container.childNodes[0].childNodes[2];
                expect(dom.refs.container.childNodes[0].childNodes.length).toBe(3);
                expect(leftTree.childNodes.length).toBe(3);
                expect(rightTree.childNodes.length).toBe(3);
            });

            it('Expend', () => {
                let dom = realRender(DualTreeSelector, {
                    datasource: datasource
                });
                let leftTree = dom.refs.container.childNodes[0].childNodes[0];
                let rightTree = dom.refs.container.childNodes[0].childNodes[2];
                TestUtils.Simulate.click(leftTree.childNodes[2].childNodes[1]);
                expect(leftTree.childNodes.length).toBe(5);
                expect(rightTree.childNodes.length).toBe(5);
            });

            it('Select UnSelect', () => {
                let value = '';
                let dom = realRender(DualTreeSelector, {
                    datasource: datasource.concat({hr: true}),
                    onChange: function (e) {
                        value = e.target.value;
                    }
                });
                let leftTree = dom.refs.container.childNodes[0].childNodes[0];
                let rightTree = dom.refs.container.childNodes[0].childNodes[2];
                expect(leftTree.childNodes.length).toBe(4);
                TestUtils.Simulate.click(leftTree.childNodes[2].childNodes[0]);
                expect(JSON.parse(value).selected['3-1']).toBe(true);
                expect(JSON.parse(value).selected['3-2']).toBe(true);
                TestUtils.Simulate.click(rightTree.childNodes[2].childNodes[0]);
                expect(value).toBe('{"selected":{}}');
            });

            it('Disabled', () => {
                let value = '';
                let dom = realRender(DualTreeSelector, {
                    disabled: true,
                    value: '{}',
                    datasource: datasource,
                    onChange: function (e) {
                        value = e.target.value;
                    }
                });
                let leftTree = dom.refs.container.childNodes[0].childNodes[0];
                let rightTree = dom.refs.container.childNodes[0].childNodes[2];
                TestUtils.Simulate.click(leftTree.childNodes[2].childNodes[1]);
                expect(leftTree.childNodes.length).toBe(3);
                expect(rightTree.childNodes.length).toBe(3);
                TestUtils.Simulate.click(leftTree.childNodes[2].childNodes[0]);
                expect(value).toBe('');
            });

            it('Load Datasource', () => {
                let actionType = '';
                let dom = realRender(DualTreeSelector, {
                    value: '',
                    datasource: datasource.concat([
                        {label: '4', value: '4', children: []},
                        {label: '5', value: '5', children: []},
                    ]),
                    onAction: function (type, param) {
                        actionType = type + ':' + JSON.stringify(param.index);
                    }
                });
                let leftTree = dom.refs.container.childNodes[0].childNodes[0];
                let rightTree = dom.refs.container.childNodes[0].childNodes[2];
                TestUtils.Simulate.click(leftTree.childNodes[3].childNodes[1]);
                expect(actionType).toBe('TreeLoadChildren:["3"]');
                TestUtils.Simulate.click(leftTree.childNodes[4].childNodes[0]);
                expect(actionType).toBe('TreeLoadChildren:["4"]');
            });

        });

    });
});
