/**
 * @file Specs for Tree
 * @author Brian Li (lbxxlht@163.com)
 * @date  07/03/2016
 */

define(function (require) {


    const _ = require('underscore');
    const React = require('react');
    const ReactDOM = require('react-dom');
    const TestUtils = React.addons.TestUtils;
    const Tree = require('Tree.jsx');


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

    describe('Tree', () => {

        describe('Base Testing', () => {

            it('Normal Tree', () => {
                let actionType = '';
                let dom = realRender(Tree, {
                    datasource: datasource,
                    onAction(type, param) {
                        actionType = type + ':' + param.item.value;
                    }
                });
                expect(dom.refs.container.childNodes.length).toBe(3);
                TestUtils.Simulate.click(dom.refs.container.childNodes[1]);
                expect(actionType).toBe('TreeLeafClick:2');
            });

            it('Disabled Tree', () => {
                let actionType = '';
                let dom = realRender(Tree, {
                    datasource: datasource,
                    disabled: true,
                    onAction(type, param) {
                        actionType = type + ':' + param.item.value;
                    }
                });
                expect(dom.refs.container.childNodes.length).toBe(3);
                TestUtils.Simulate.click(dom.refs.container.childNodes[1]);
                expect(actionType).toBe('');
            });

            it('Expend Tree', () => {
                let dom = realRender(Tree, {
                    datasource: datasource
                });
                expect(dom.refs.container.childNodes.length).toBe(3);
                TestUtils.Simulate.click(dom.refs.container.childNodes[2].childNodes[0]);
                expect(dom.refs.container.childNodes.length).toBe(5);
            });

            it('Empty Value', () => {
                let dom = realRender(Tree, {
                    value: '{}',
                    datasource: datasource
                });
                expect(dom.refs.container.childNodes.length).toBe(3);
                TestUtils.Simulate.click(dom.refs.container.childNodes[2].childNodes[0]);
                expect(dom.refs.container.childNodes.length).toBe(3);
            });

            it('Empty Datasource', () => {
                let dom = realRender(Tree, {
                    value: '{}',
                    datasource: null
                });
                expect(dom.refs.container.childNodes.length).toBe(0);
            });

            it('Incorrect Value', () => {
                let dom = realRender(Tree, {
                    value: '',
                    datasource: datasource,
                    leafRenderer: 123
                });
                expect(dom.refs.container.childNodes.length).toBe(3);
            });

        });

    });
});
