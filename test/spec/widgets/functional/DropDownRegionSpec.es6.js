/**
 * @file Specs for DropDownRegion
 * @author Brian Li (lbxxlht@163.com)
 * @date  07/03/2016
 */

define(function (require) {


    const _ = require('underscore');
    const React = require('react');
    const ReactDOM = require('react-dom');
    const TestUtils = React.addons.TestUtils;
    const DropDownRegion = require('DropDownRegion.jsx');


    function realRender(Component, props) {
        return TestUtils.renderIntoDocument(<Component {...props} />);
    }

    describe('DropDownRegion', () => {

        describe('Base Testing', () => {

            it('Normal DropDownRegion', () => {
                let dom = realRender(DropDownRegion, {});
                // expect(dom.refs.container.childNodes.length).toBe(7);
                // TestUtils.Simulate.mouseDown(dom.refs.container.childNodes[6]);
                // TestUtils.Simulate.click(dom.refs.container, {clientX: 9});
                // dom.onDrop(0, 2);
            });

        });

    });
});
