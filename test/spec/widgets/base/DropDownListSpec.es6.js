/**
 * @file Specs for DropDownList
 * @author Brian Li (lbxxlht@163.com)
 * @author Wang Yi(wangyispaceman@gmail.com)
 * @date  07/03/2016
 */

define(function (require) {
    const React = require('react');
    const TestUtils = React.addons.TestUtils;
    const DropDownList = require('DropDownList.jsx');
    const Layer = require('Layer.jsx');

    function shallowRender(Component, props = {}) {
        let renderer = TestUtils.createRenderer();
        renderer.render(<Component {...props} />);
        return renderer.getRenderOutput();
    }

    function realRender(Component, props = {}) {
        return TestUtils.renderIntoDocument(<Component {...props} />);
    }

    describe('DropDownList', () => {
        // Testing structure
        describe('Testing DropDownList with shallow render', () => {
            let listProps = {};

            beforeEach(() => {
                listProps = {
                    skin: 'test-skin',
                    className: 'fcui2-dropdownlist-test',
                    style: {
                        color: '#FFF'
                    },
                    label: 'TestDropDownList'
                };
            });

            it('Renders a dropdownlist with default props', () => {
                let dropdownlist = shallowRender(DropDownList);
                expect(dropdownlist.type).toBe('div');
                expect(dropdownlist.props.className).toBe('fcui2-dropdownlist fcui2-dropdownlist-normal browser-chrome');
                expect(dropdownlist.props.style).toEqual({});
                expect(dropdownlist.props.children[0]).toEqual(
                    <div className="icon-right font-icon font-icon-largeable-caret-down"></div>
                );
                expect(dropdownlist.props.children[1]).toEqual(
                    <span className="label-container">DropDownList</span>
                );

                let layer = dropdownlist.props.children[2];
                expect(layer.type).toEqual(Layer);
                expect(layer.props.isOpen).toBe(false);
            });

            it('Renders a dropdownlist with given props', () => {
                let dropdownlist = shallowRender(DropDownList, listProps);
                expect(dropdownlist.type).toBe('div');
                expect(dropdownlist.props.className).toBe('fcui2-dropdownlist fcui2-dropdownlist-test fcui2-dropdownlist-test-skin browser-chrome');
                expect(dropdownlist.props.style).toEqual({color: '#FFF'});
                expect(dropdownlist.props.children[0]).toEqual(
                    <div className="icon-right font-icon font-icon-largeable-caret-down"></div>
                );
                expect(dropdownlist.props.children[1]).toEqual(
                    <span className="label-container">TestDropDownList</span>
                );
            });
        });

        // Testing behaviour
        describe('Testing DropDownList through simulate events', () => {
            let listProps = {};
            let datasource = [];
            let currentValue = '';

            beforeEach(() => {
                datasource = [
                    {label: 'label-1', value: '1'},
                    {label: 'label-2', value: '2'},
                    {label: 'label-3', value: '3'}
                ];
                currentValue = '';
                listProps = {
                    datasource: datasource,
                    onClick(e) {
                        currentValue = e.target.value;
                    }
                };
            });

            it('Simulating mouse events of dropdownlist layer', () => {
                jasmine.clock().install();
                let dropdownlist = realRender(DropDownList, listProps);
                let containerDom = TestUtils.findRenderedDOMComponentWithClass(dropdownlist, 'fcui2-dropdownlist');
                expect(dropdownlist.state.layerOpen).toBe(false);
                expect(dropdownlist.state.mouseenter).toBe(false);

                TestUtils.Simulate.mouseEnter(containerDom);
                expect(dropdownlist.state.layerOpen).toBe(true);
                expect(dropdownlist.state.mouseenter).toBe(true);
                expect(dropdownlist.refs.layer.props.isOpen).toBe(true);

                TestUtils.Simulate.mouseLeave(containerDom);
                jasmine.clock().tick(201);
                expect(dropdownlist.state.layerOpen).toBe(false);
                expect(dropdownlist.state.mouseenter).toBe(false);

                listProps.openLayerType = 'onClick';
                dropdownlist = realRender(DropDownList, listProps);
                containerDom = TestUtils.findRenderedDOMComponentWithClass(dropdownlist, 'fcui2-dropdownlist');

                TestUtils.Simulate.click(containerDom);
                expect(dropdownlist.state.layerOpen).toBe(true);
                expect(dropdownlist.state.mouseenter).toBe(true);
                expect(dropdownlist.refs.layer.props.isOpen).toBe(true);

                jasmine.clock().uninstall();
            });

            it('Simulating click event of dropdownlist layer', () => {
                spyOn(listProps, 'onClick').and.callThrough();
                let dropdownlist = realRender(DropDownList, listProps);
                expect(dropdownlist.props.onClick.calls.any()).toBeFalsy();
                expect(currentValue).toBe('');
                expect(dropdownlist.state.layerOpen).toBe(false);
                expect(dropdownlist.state.mouseenter).toBe(false);

                let containerDom = TestUtils.findRenderedDOMComponentWithClass(dropdownlist, 'fcui2-dropdownlist');
                TestUtils.Simulate.mouseEnter(containerDom);
                expect(dropdownlist.state.layerOpen).toBe(true);
                expect(dropdownlist.state.mouseenter).toBe(true);
                expect(dropdownlist.refs.layer.props.isOpen).toBe(true);

                let listItems = dropdownlist.refs.layer.___layerContainer___.querySelectorAll('.list-normal-item');
                TestUtils.Simulate.click(listItems[0]);
                expect(dropdownlist.props.onClick.calls.any()).toBeTruthy();
                expect(dropdownlist.props.onClick.calls.count()).toBe(1);
                expect(currentValue).toBe('1');
                expect(dropdownlist.state.layerOpen).toBe(false);


                

            });
        });
    });
});
