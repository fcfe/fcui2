/**
 * @file Specs for Select
 * @author Brian Li (lbxxlht@163.com)
 * @date  07/03/2016
 */

define(function (require) {

    const _ = require('underscore');
    const React = require('react');
    const ReactDOM = require('react-dom');
    const TestUtils = React.addons.TestUtils;
    const Select = require('Select.jsx');
    const Layer = require('Layer.jsx');

    function shallowRender(Component, props) {
        props = props || {};
        let renderer = TestUtils.createRenderer();
        renderer.render(<Component {...props} />);
        return renderer.getRenderOutput();
    }

    function realRender(Component, props) {
        props = props || {};
        return TestUtils.renderIntoDocument(<Component {...props} />);
    }

    describe('Select', () => {

        describe('Base Testing', () => {
            let datasource = [
                {value: 'item 1', label: 'label 1'},
                {hr: true, value: 'item 2', label: 'label 2'},
                {value: 'item 3', label: 'label 3', disabled: true}
            ];

            it('Normal Select', () => {
                let dom = shallowRender(Select, {
                    datasource: datasource
                });
                let child1 = dom.props.children[1];
                expect(dom.type).toBe('div');
                expect(dom.props.className).toBe('fcui2-dropdownlist fcui2-dropdownlist-normal');
                expect(child1).toEqual(
                    <div className="label-container">please select</div>
                );
            });

            it('Real Select', () => {
                let value = '';
                let dom = realRender(Select, {
                    datasource: datasource,
                    onChange(e) {
                        value = e.target.value;
                    }
                });
                TestUtils.Simulate.mouseEnter(dom.refs.container);
                expect(dom.refs.layer.props.isOpen).toBe(true);
                let layerContainer = dom.refs.layer.___layerContainer___.childNodes[0];
                expect(layerContainer.childNodes.length).toBe(3);   
                TestUtils.Simulate.click(layerContainer.childNodes[0]);  
                expect(value).toBe('item 1');
                TestUtils.Simulate.mouseLeave(dom.refs.container);
                expect(dom.refs.layer.props.isOpen).toBe(false);
                expect(dom.refs.layer.___layerContainer___.childNodes.length).toBe(0);

                TestUtils.Simulate.mouseEnter(dom.refs.container);
                expect(dom.refs.layer.props.isOpen).toBe(true);

                ReactDOM.unmountComponentAtNode(dom.refs.layer.___layerContainer___);
                expect(dom.refs.layer.___layerContainer___.childNodes.length).toBe(0);

            });

        });

    });
});
