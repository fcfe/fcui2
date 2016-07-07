/**
 * @file Specs for AlphabetRegion
 * @author Brian Li (lbxxlht@163.com)
 * @date  07/03/2016
 */

define(function (require) {


    const _ = require('underscore');
    const React = require('react');
    const ReactDOM = require('react-dom');
    const TestUtils = React.addons.TestUtils;
    const AlphabetRegion = require('AlphabetRegion.jsx');


    function realRender(Component, props) {
        return TestUtils.renderIntoDocument(<Component {...props} />);
    }

    describe('AlphabetRegion', () => {

        describe('Base Testing', () => {

            it('Normal AlphabetRegion', () => {
                let dom = realRender(AlphabetRegion, {});
                expect(dom.refs.container.childNodes.length).toBe(2);
            });

            it('Test Event', () => {
                let value = '';
                let dom = realRender(AlphabetRegion, {
                    onClick(e) {
                        value = e.target.value;
                    }
                });
                TestUtils.Simulate.click(
                    dom.refs.container.childNodes[1].childNodes[0]
                        .childNodes[1].childNodes[0]
                        .childNodes[1].childNodes[0]
                );
                expect(value).toBe('142');
                TestUtils.Simulate.click(dom.refs.container.childNodes[0].childNodes[5]);
            });

            it('Disabled', () => {
                let value = '';
                let dom = realRender(AlphabetRegion, {
                    disabled: true,
                    onClick(e) {
                        value = e.target.value;
                    }
                });
                TestUtils.Simulate.click(
                    dom.refs.container.childNodes[1].childNodes[0]
                        .childNodes[1].childNodes[0]
                        .childNodes[1].childNodes[0]
                );
                expect(value).toBe('');
                TestUtils.Simulate.click(dom.refs.container.childNodes[0].childNodes[5]);
            });

        });

    });
});
