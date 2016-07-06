/**
 * @file Specs for SearchBox
 * @author Brian Li (lbxxlht@163.com)
 * @date  07/03/2016
 */

define(function (require) {


    const _ = require('underscore');
    const React = require('react');
    const ReactDOM = require('react-dom');
    const TestUtils = React.addons.TestUtils;
    const SearchBox = require('SearchBox.jsx');


    function realRender(Component, props) {
        return TestUtils.renderIntoDocument(<Component {...props} />);
    }

    describe('SearchBox', () => {

        describe('Base Testing', () => {

            it('Normal SearchBox', () => {
                let value = '';
                let dom = realRender(SearchBox, {
                    value: 'value main',
                    width: 'abc',
                    onClick(e) {
                        value = e.target.value;
                    }
                });
                expect(dom.refs.container.childNodes.length).toBe(3);
                TestUtils.Simulate.click(dom.refs.container.childNodes[2]);
                expect(value).toBe('value main');
                dom.focus();
            });

            it('SearchBox with Property', () => {
                let value = 'abc';
                let dom = realRender(SearchBox, {
                    value: null,
                    valueTemplate: null,
                    width:700,
                    onClick(e) {
                        value = e.target.value;
                    }
                });
                expect(dom.refs.container.childNodes[1].style.width).toBe('670px');
                TestUtils.Simulate.click(dom.refs.container.childNodes[2]);
                expect(value).toBe(null);
            });

            it('SearchBox with Property2', () => {
                let value = 'abc';
                let dom = realRender(SearchBox, {
                    value: null,
                    valueTemplate: null
                });
                TestUtils.Simulate.click(dom.refs.container.childNodes[2]);
                expect(value).toBe('abc');
            });
        });

    });
});
