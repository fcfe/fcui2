/**
 * @file Specs for Table
 * @author Brian Li (lbxxlht@163.com)
 * @date  07/03/2016
 */

define(function (require) {


    const _ = require('underscore');
    const React = require('react');
    const ReactDOM = require('react-dom');
    const TestUtils = React.addons.TestUtils;
    const Table = require('Table.jsx');


    function realRender(Component, props) {
        return TestUtils.renderIntoDocument(<Component {...props} />);
    }

    describe('Table', () => {

        describe('Base Testing', () => {

            it('Normal Table', () => {
                let dom = realRender(Table, {});
                // expect(dom.refs.container.childNodes.length).toBe(7);
                // TestUtils.Simulate.mouseDown(dom.refs.container.childNodes[6]);
                // TestUtils.Simulate.click(dom.refs.container, {clientX: 9});
                // dom.onDrop(0, 2);
            });

        });

    });
});
