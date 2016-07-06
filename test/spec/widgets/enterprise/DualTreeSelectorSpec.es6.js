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
                // let leftTree = dom.refs.container.childNodes[0].childNodes[0];
                // let rightTree = dom.refs.container.childNodes[0].childNodes[2];
                // expect(dom.refs.container.childNodes[0].childNodes.length).toBe(3);
                // expect(leftTree.childNodes.length).toBe(3);
                // expect(rightTree.childNodes.length).toBe(3);
            });

        });

    });
});
