/**
 * @file Specs for List
 * @author Wang Yi(wangyispaceman@gmail.com)
 * @date Tue May 17 2016
 */

define(function (require) {
    const _ = require('underscore');
    const React = require('react');
    const TestUtils = React.addons.TestUtils;
    const List = require('List.jsx');

    function shallowRender(Component, props = {}) {
        let renderer = TestUtils.createRenderer();
        renderer.render(<Component {...props} />);
        return renderer.getRenderOutput();
    }

    function realRender(Component, props = {}) {
        return TestUtils.renderIntoDocument(<Component {...props} />);
    }

    describe('List', () => {
        // Testing structure
        describe('Testing List with shallow render', () => {
            let listProps = {};
            let datasource = [];

            beforeEach(() => {
                datasource = [
                    {value: 'item 1', label: 'label 1'},
                    {hr: true, value: 'item 2', label: 'label 2'},
                    {value: 'item 3', label: 'label 3', disabled: true}
                ];
                listProps = {
                    skin: 'test-skin',
                    className: 'fcui2-list-test',
                    style: {
                        color: '#FFF'
                    },
                    width: 100,
                    datasource: datasource,
                    disabled: false
                };
            });

            it('Renders a list with default props', () => {
                let list = shallowRender(List);
                expect(list.type).toBe('div');
                expect(list.props.className).toBe('fcui2-list fcui2-list-normal browser-chrome');
                expect(list.props.style).toEqual({});
                expect(list.props.children).toBeNull();
            });

            it('Renders a list with given props', () => {
                let list = shallowRender(List, listProps);
                expect(list.type).toBe('div');
                expect(list.props.className).toBe('fcui2-list fcui2-list-test fcui2-list-test-skin browser-chrome');
                expect(list.props.style).toEqual({color: '#FFF', width: 98});

                let listChildren = list.props.children;
                let Renderer = List.defaultProps.itemRenderer;
                let onClick = List.defaultProps.onClick;
                expect(listChildren[0]).toEqual(
                    <Renderer key="0" label="label 1" value="item 1" disabled={false} onClick={onClick}
                        ref="list-item-0"
                        parentComponent={listChildren[0].props.parentComponent}
                    />
                );
                expect(listChildren[1]).toEqual(<hr key='1' ref="list-item-1" />);
                expect(listChildren[2]).toEqual(
                    <Renderer key="2" label="label 3" value="item 3" disabled={true} onClick={onClick}
                        ref="list-item-2"
                        parentComponent={listChildren[2].props.parentComponent}
                    />
                );
            });
        });

        // Testing behaviour
        describe('Testing List through simulate events', () => {
            let listProps = {};
            let currentValue = '';

            beforeEach(() => {
                let datasource = [
                    {label: 'label-1', value: 'item-1'},
                    {label: 'label-2', value: 'item-2'},
                    {label: 'label-3', value: 'item-3', disabled: true}
                ];
                listProps = {
                    datasource: datasource,
                    onClick(e) {
                        currentValue = e.target.value;
                    }
                };
            });

            it('Simulating click event on a list', () => {
                spyOn(listProps, 'onClick').and.callThrough();
                let list = realRender(List, listProps);
                let Item = List.defaultProps.itemRenderer;
                let listItems = TestUtils.scryRenderedComponentsWithType(list, Item);
                expect(currentValue).toBe('');

                TestUtils.Simulate.click(listItems[0].refs.container);
                let event = list.props.onClick.calls.mostRecent().args[0];
                expect(list.props.onClick.calls.any()).toBeTruthy();
                expect(list.props.onClick.calls.count()).toBe(1);
                expect(event.target).toEqual(listItems[0].refs.container);
                expect(event.target.value).toBe('item-1');
                expect(currentValue).toBe('item-1');

                list.props.onClick.calls.reset();
                TestUtils.Simulate.click(listItems[1].refs.container);
                event = list.props.onClick.calls.mostRecent().args[0];
                expect(list.props.onClick.calls.any()).toBeTruthy();
                expect(list.props.onClick.calls.count()).toBe(1);
                expect(event.target).toEqual(listItems[1].refs.container);
                expect(event.target.value).toBe('item-2');
                expect(currentValue).toBe('item-2');

                list.props.onClick.calls.reset();
                TestUtils.Simulate.click(listItems[2].refs.container);
                expect(list.props.onClick.calls.any()).toBeFalsy();
                expect(currentValue).toBe('item-2');
            });
        });
    });
});
