/**
 * @file Specs for ComboList
 * @author Brian Li (lbxxlht@163.com)
 * @date  07/03/2016
 */

define(function (require) {


    const _ = require('underscore');
    const React = require('react');
    const ReactDOM = require('react-dom');
    const TestUtils = React.addons.TestUtils;
    const ComboList = require('ComboList.jsx');


    function realRender(Component, props) {
        return TestUtils.renderIntoDocument(<Component {...props} />);
    }


    describe('ComboList', () => {

        describe('Base Testing', () => {

            it('Normal ComboList', () => {
                let value = '';
                let dom = realRender(ComboList, {
                    datasource: [
                        {label: 'label1', value: 'value1'},
                        {label: 'label2', value: 'value2'}
                    ],
                    value: 'value main',
                    onClick(e) {
                        value = e.target.value;
                    }
                });
                expect(dom.refs.container.childNodes.length).toBe(4);
                TestUtils.Simulate.click(dom.refs.container);
                expect(value).toBe('value main');
                expect(dom.refs.list).toBe(undefined);
            });

            it('Open Layer', () => {
                let value = '';
                let dom = realRender(ComboList, {
                    datasource: [
                        {label: 'label1', value: 'value1'},
                        {label: 'label2', value: 'value2'}
                    ],
                    value: 'value main',
                    onClick(e) {
                        value = e.target.value;
                    }
                });
                TestUtils.Simulate.click(dom.refs.container.childNodes[0]);
                expect(dom.refs.list.refs.container.childNodes.length).toBe(2);
                TestUtils.Simulate.click(dom.refs.list.refs.container.childNodes[0]);
                expect(value).toBe('value1');
                TestUtils.Simulate.mouseLeave(dom.refs.container);
                expect(dom.state.layerOpen).toBe(false);
            });

            it('Disabled', () => {
                let value = '';
                let dom = realRender(ComboList, {
                    disabled: true,
                    datasource: [
                        {label: 'label1', value: 'value1'},
                        {label: 'label2', value: 'value2'}
                    ],
                    value: 'value main',
                    onClick(e) {
                        value = e.target.value;
                    }
                });
                TestUtils.Simulate.click(dom.refs.container.childNodes[0]);
                expect(dom.refs.list).toBe(undefined);
                TestUtils.Simulate.mouseLeave(dom.refs.container);
                expect(dom.state.layerOpen).toBe(false);
                dom.onListClick();
                expect(value).toBe('');
            });

        });

    });
});
